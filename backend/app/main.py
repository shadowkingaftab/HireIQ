from fastapi import FastAPI, Depends, HTTPException, File, UploadFile, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional, Any
from datetime import datetime
from pydantic import BaseModel, ConfigDict
import uuid
import io
import logging
import magic
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

from . import models, database
from .models.candidate import Candidate
from .models.skill import Skill
from .models.job import Job
from .services.resume_parser import parse_resume
from .services.jd_parser import parse_jd
from .services.github_fetcher import fetch_github_data
from .services.matching_engine import calculate_match_score
from .services.assessment_engine import generate_assessment, grade_assessment, ASSESSMENT_BANK
from .services.adaptive_testing import generate_adaptive_assessment
from .services.endorsement_service import add_endorsement, get_endorsements
from .services.skill_graph_service import update_skill_graph, build_skill_graph
from .services.feedback_service import add_feedback, get_feedback_for_candidate, add_survey_feedback
from .services.weight_manager import get_skill_weights, adjust_skill_weights
from .services.analytics_service import track_event, get_analytics, track_funnel_step
from .services.payment_service import create_checkout_session, handle_webhook
from .services.greenhouse_service import get_greenhouse_jobs, sync_candidate_to_greenhouse
from .services.recruiter_analytics import get_recruiter_analytics as get_advanced_recruiter_analytics
from .services.ml_ranking import train_ranking_model
from .services.auth_service import (
    get_password_hash,
    create_access_token,
    get_current_user,
    verify_password,
    ACCESS_TOKEN_EXPIRE_MINUTES
)
from .models.user import User
from .models.recruiter import Recruiter
from .models.subscription import Subscription
from .models.team import Team
from .models.candidate_notes import CandidateNote
from .models.recruiter_preferences import RecruiterPreference
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse

app = FastAPI()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Initialize Sentry
SENTRY_DSN = os.getenv("SENTRY_DSN")
if SENTRY_DSN:
    sentry_sdk.init(
        dsn=SENTRY_DSN,
        integrations=[FastApiIntegration()],
        traces_sample_rate=1.0
    )

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://proofhire.vercel.app"],  # Added Vercel URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def handle_exception(request, exc):
    logger.error(f"Unhandled Exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"message": "Internal server error"}
    )

# Pydantic models for request/response
class CandidateBase(BaseModel):
    name: Optional[str] = None
    email: str
    github_username: Optional[str] = None

class CandidateCreate(CandidateBase):
    pass

class CandidateResponse(CandidateBase):
    id: uuid.UUID
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class SkillBase(BaseModel):
    name: str
    category: Optional[str] = None

class SkillCreate(SkillBase):
    pass

class SkillResponse(SkillBase):
    id: uuid.UUID
    
    model_config = ConfigDict(from_attributes=True)

class JobBase(BaseModel):
    title: str
    description: str
    required_skills: Optional[List[str]] = None
    nice_to_have_skills: Optional[List[str]] = None

class JobCreate(JobBase):
    pass

class JobResponse(JobBase):
    id: uuid.UUID
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class JDInput(BaseModel):
    text: str

class MatchRequest(BaseModel):
    candidate_data: Dict[str, Any]
    jd_data: Dict[str, Any]
    github_data: Optional[Dict[str, Any]] = None

class FeedbackCreate(BaseModel):
    candidate_id: str
    job_id: str
    hired: bool
    performance_score: Optional[float] = None
    notes: Optional[str] = None

# Dependency to get DB session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Root and Health check
@app.get("/")
def read_root():
    return {"message": "ProofHire API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Candidates Endpoints
@app.post("/candidates/", response_model=CandidateResponse)
def create_candidate(candidate: CandidateCreate, db: Session = Depends(get_db)):
    db_candidate = Candidate(**candidate.model_dump())
    db.add(db_candidate)
    db.commit()
    db.refresh(db_candidate)
    return db_candidate

@app.get("/candidates/", response_model=List[CandidateResponse])
def read_candidates(db: Session = Depends(get_db)):
    return db.query(Candidate).all()

@app.get("/candidates/{candidate_id}", response_model=CandidateResponse)
def read_candidate(candidate_id: uuid.UUID, db: Session = Depends(get_db)):
    db_candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if db_candidate is None:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return db_candidate

# Skills Endpoints
@app.post("/skills/", response_model=SkillResponse)
def create_skill(skill: SkillCreate, db: Session = Depends(get_db)):
    db_skill = Skill(**skill.model_dump())
    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)
    return db_skill

@app.get("/skills/", response_model=List[SkillResponse])
def read_skills(db: Session = Depends(get_db)):
    return db.query(Skill).all()

# Jobs Endpoints
@app.post("/jobs/", response_model=JobResponse)
def create_job(job: JobCreate, db: Session = Depends(get_db)):
    db_job = Job(**job.model_dump())
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

@app.get("/jobs/", response_model=List[JobResponse])
def read_jobs(db: Session = Depends(get_db)):
    return db.query(Job).all()

# Resume Parsing Endpoint
@app.post("/parse-resume/")
async def parse_resume_endpoint(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    contents = await file.read()
    
    # MIME type validation
    mime = magic.Magic(mime=True)
    mime_type = mime.from_buffer(contents)
    if mime_type != 'application/pdf':
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDF files are allowed.")
    
    pdf_file = io.BytesIO(contents)
    
    try:
        result = parse_resume(pdf_file)
        # Track event
        track_event(db, "resume_uploaded", event_metadata={
            "skills_count": len(result.get("skills", []))
        })
        track_funnel_step(db, "resume_uploaded", "main")
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error parsing resume: {str(e)}")

# JD Parsing Endpoint
@app.post("/parse-jd/")
async def parse_jd_endpoint(jd_input: JDInput, db: Session = Depends(get_db)):
    try:
        result = parse_jd(jd_input.text)
        # Track funnel step
        track_funnel_step(db, "jd_pasted", "main")
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error parsing JD: {str(e)}")

# GitHub Data Endpoint
@app.get("/github/{username}")
async def get_github_data(username: str, db: Session = Depends(get_db)):
    data = fetch_github_data(username)
    if "error" in data:
        raise HTTPException(status_code=404, detail=data["error"])
    
    # Track funnel step
    track_funnel_step(db, "github_connected", "main")
    return data

# Matching Endpoint
@app.post("/match")
async def match_endpoint(
    request: MatchRequest, 
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    try:
        result = calculate_match_score(
            request.candidate_data,
            request.jd_data,
            request.github_data,
            db=db,
            recruiter_id=current_user
        )
        # Track event
        track_event(db, "match_analyzed", event_metadata={
            "fit_score": result.get("fit_score")
        })
        track_funnel_step(db, "match_analyzed", "main")
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Skill Weights Endpoints
@app.get("/skill-weights/")
async def get_skill_weights_endpoint(db: Session = Depends(get_db)):
    return get_skill_weights(db)

@app.post("/skill-weights/adjust")
async def adjust_skill_weights_endpoint(db: Session = Depends(get_db)):
    return adjust_skill_weights(db)

# Payment Endpoints
class CheckoutRequest(BaseModel):
    plan_type: str
    success_url: str
    cancel_url: str

@app.post("/create-checkout-session")
async def checkout_session(
    request: CheckoutRequest,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        session = create_checkout_session(
            current_user, 
            request.plan_type, 
            request.success_url, 
            request.cancel_url
        )
        return {"id": session.id, "url": session.url}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/webhook/stripe")
async def stripe_webhook(
    request: Request,
    db: Session = Depends(get_db)
):
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')
    endpoint_secret = os.getenv("STRIPE_WEBHOOK_SECRET")
    
    event = handle_webhook(payload, sig_header, endpoint_secret, db)
    if event:
        return {"status": "success"}
    else:
        raise HTTPException(status_code=400, detail="Invalid webhook")

# Recruiter Dashboard Endpoints
@app.get("/recruiter/dashboard")
async def get_recruiter_dashboard(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if user has team plan or is recruiter
    sub = db.query(Subscription).filter(Subscription.user_id == current_user).first()
    if not sub or sub.plan_type != "team":
        raise HTTPException(status_code=403, detail="Recruiter dashboard requires Team plan.")
        
    recruiter = db.query(Recruiter).filter(Recruiter.user_id == current_user).first()
    
    # Get all candidates (simplified for now)
    candidates = db.query(Candidate).all()
    
    # Get recent feedback
    from .models.feedback import HiringFeedback
    feedback = db.query(HiringFeedback).all()
    
    return {
        "recruiter": recruiter,
        "candidates_count": len(candidates),
        "total_feedback": len(feedback),
        "candidates": [
            {
                "id": c.id,
                "name": c.name,
                "email": c.email,
                "github": c.github_username,
                "created_at": c.created_at
            } for c in candidates[:10]
        ]
    }

# Team Collaboration Endpoints
@app.post("/teams")
async def create_team(
    name: str,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if user has team plan
    sub = db.query(Subscription).filter(Subscription.user_id == current_user).first()
    if not sub or sub.plan_type != "team":
        raise HTTPException(status_code=403, detail="Team creation requires Team plan.")
        
    team = Team(name=name, owner_id=current_user)
    db.add(team)
    db.commit()
    db.refresh(team)
    return team

@app.get("/teams/my")
async def get_my_teams(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    teams = db.query(Team).filter(Team.owner_id == current_user).all()
    return teams

@app.post("/teams/join/{invite_code}")
async def join_team(
    invite_code: str,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    team = db.query(Team).filter(Team.invite_code == invite_code).first()
    if not team:
        raise HTTPException(status_code=404, detail="Invalid invite code.")
        
    user = db.query(User).filter(User.id == current_user).first()
    if user not in team.members:
        team.members.append(user)
        db.commit()
        
    return {"status": "joined", "team_name": team.name}

# Candidate Notes Endpoints
class NoteCreate(BaseModel):
    note: str

@app.post("/teams/{team_id}/candidates/{candidate_id}/notes")
async def add_candidate_note(
    team_id: str,
    candidate_id: str,
    note_data: NoteCreate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    # Verify user is in team
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    # Check if user is owner or member
    user = db.query(User).filter(User.id == current_user).first()
    if team.owner_id != uuid.UUID(current_user) and user not in team.members:
        raise HTTPException(status_code=403, detail="Not authorized to post to this team")

    candidate_note = CandidateNote(
        candidate_id=candidate_id,
        user_id=current_user,
        team_id=team_id,
        note=note_data.note
    )
    db.add(candidate_note)
    db.commit()
    db.refresh(candidate_note)
    return candidate_note

@app.get("/teams/{team_id}/candidates/{candidate_id}/notes")
async def get_candidate_notes(
    team_id: str,
    candidate_id: str,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    # Verify user is in team
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    user = db.query(User).filter(User.id == current_user).first()
    if team.owner_id != uuid.UUID(current_user) and user not in team.members:
        raise HTTPException(status_code=403, detail="Not authorized to view this team's notes")

    notes = db.query(CandidateNote).filter(
        CandidateNote.candidate_id == candidate_id,
        CandidateNote.team_id == team_id
    ).all()
    return notes

# Recruiter Preferences Endpoints
@app.get("/recruiter/preferences")
async def get_recruiter_preferences(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    prefs = db.query(RecruiterPreference).filter(
        RecruiterPreference.recruiter_id == current_user
    ).first()
    if not prefs:
        prefs = RecruiterPreference(recruiter_id=current_user)
        db.add(prefs)
        db.commit()
        db.refresh(prefs)
    return prefs

@app.post("/recruiter/preferences")
async def update_recruiter_preferences(
    preferences: dict,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    db_prefs = db.query(RecruiterPreference).filter(
        RecruiterPreference.recruiter_id == current_user
    ).first()
    if not db_prefs:
        db_prefs = RecruiterPreference(recruiter_id=current_user)
        db.add(db_prefs)

    for key, value in preferences.items():
        if hasattr(db_prefs, key) and key != "recruiter_id":
            setattr(db_prefs, key, value)
            
    db.commit()
    db.refresh(db_prefs)
    return db_prefs

# Greenhouse ATS Endpoints
@app.get("/ats/greenhouse/jobs")
async def get_greenhouse_jobs_endpoint():
    try:
        return get_greenhouse_jobs()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ats/greenhouse/sync/{candidate_id}/{job_id}")
async def sync_to_greenhouse(
    candidate_id: str,
    job_id: str,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    try:
        # Verify user has access to this job (recruiter check)
        # Assuming for now recruiters are linked to jobs via some logic or we just check if job exists
        job = db.query(Job).filter(Job.id == job_id).first()
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")

        return sync_candidate_to_greenhouse(candidate_id, job_id, db)
    except Exception as e:
        logger.error(f"Greenhouse sync error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Analytics Endpoints (Day 38)
@app.post("/analytics/track")
async def track_event_endpoint(
    event_type: str,
    event_metadata: dict = None,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    track_event(db, event_type, current_user, event_metadata)
    return {"status": "tracked"}

@app.get("/analytics/")
async def get_analytics_endpoint(
    event_type: str = None,
    days: int = 7,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    # In a real app, check if user is admin/recruiter
    return get_analytics(db, event_type, days)

@app.get("/recruiter/analytics")
async def get_recruiter_analytics_endpoint(
    days: int = 30,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    # Verify recruiter status via subscription or is_recruiter flag
    sub = db.query(Subscription).filter(Subscription.user_id == current_user).first()
    user = db.query(User).filter(User.id == current_user).first()
    
    if not user.is_recruiter and (not sub or sub.plan_type not in ["pro", "team"]):
        raise HTTPException(status_code=403, detail="Advanced analytics require a Pro or Team plan.")

    return get_advanced_recruiter_analytics(db, current_user, days)

# Candidate Profile Endpoint (Day 32)
@app.get("/candidates/profile/{candidate_id}")
async def get_candidate_profile(
    candidate_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    # Get assessments
    from .models.assessment import CandidateAssessment
    assessments = db.query(CandidateAssessment).filter(
        CandidateAssessment.candidate_id == candidate_id
    ).all()

    # Get skill graph
    from .models.skill_graph import SkillGraph
    skill_graph = db.query(SkillGraph).filter(
        SkillGraph.candidate_id == candidate_id
    ).first()

    return {
        "id": candidate.id,
        "name": candidate.name,
        "email": candidate.email,
        "github_username": candidate.github_username,
        "created_at": candidate.created_at,
        "assessments": [
            {
                "id": a.id,
                "skill": a.skill_id,
                "score": a.score,
                "completed_at": a.created_at
            }
            for a in assessments
        ],
        "skill_graph": skill_graph.data if skill_graph else None
    }

@app.post("/ml/train")
async def train_ml_model_endpoint(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    # Only allow admin or system to train
    user = db.query(User).filter(User.id == current_user).first()
    if not user or user.email != "admin@proofhire.com": # Simple admin check
        raise HTTPException(status_code=403, detail="Admin access required for model training")
    
    return train_ranking_model(db)

# Assessment Endpoints
@app.get("/assessments/{skill}/{difficulty}")
async def get_assessment(skill: str, difficulty: str = "medium"):
    assessment = generate_assessment(skill, difficulty)
    if not assessment:
        raise HTTPException(status_code=404, detail="No assessments found")
    return assessment

@app.get("/assessments/adaptive/{skill}")
async def get_adaptive_assessment(
    skill: str,
    current_difficulty: str = "medium",
    passed: bool = None
):
    assessment = generate_adaptive_assessment(skill, current_difficulty, passed)
    if not assessment:
        raise HTTPException(status_code=404, detail="No assessments found")
    return assessment

@app.post("/assessments/grade")
async def grade_assessment_endpoint(
    assessment_id: str,
    code: str,
    db: Session = Depends(get_db)
):
    # In a real app, fetch the assessment from DB
    # For now, we'll use the assessment bank
    assessment = next(
        (a for a in ASSESSMENT_BANK.get("Python", {}).get("medium", []) 
         if a["problem"] == assessment_id),
        None
    )
    if not assessment:
        # Check easy bank if medium fails
        assessment = next(
            (a for a in ASSESSMENT_BANK.get("Python", {}).get("easy", []) 
             if a["problem"] == assessment_id),
            None
        )
        
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    result = grade_assessment(code, assessment)
    return result

# Endorsement Endpoints
@app.post("/endorsements/")
async def create_endorsement(
    candidate_id: str,
    skill_id: str,
    db: Session = Depends(get_db)
):
    # In a real app, get endorser_id from auth
    endorser_id = str(uuid.uuid4())  # Placeholder for current user
    return add_endorsement(db, candidate_id, endorser_id, skill_id)

@app.get("/endorsements/{candidate_id}")
async def read_endorsements(candidate_id: str, db: Session = Depends(get_db)):
    return get_endorsements(db, candidate_id)

@app.get("/candidate-assessments/{candidate_id}")
async def get_candidate_assessments(
    candidate_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    from .models.assessment import CandidateAssessment
    assessments = db.query(CandidateAssessment).filter(
        CandidateAssessment.candidate_id == candidate_id
    ).all()
    return [
        {
            "id": a.id,
            "skill": a.skill_id,
            "difficulty": "N/A",  # Difficulty might not be stored in CandidateAssessment
            "score": a.score,
            "completed_at": a.created_at
        }
        for a in assessments
    ]

# Skill Graph Endpoints
@app.post("/skill-graph/{candidate_id}")
async def update_skill_graph_endpoint(
    candidate_id: str,
    skills: list = None,
    github_data: dict = None,
    db: Session = Depends(get_db)
):
    if not skills:
        raise HTTPException(status_code=400, detail="Skills are required")

    graph = update_skill_graph(db, candidate_id, skills, github_data)
    return graph

# Auth Endpoints
@app.post("/token")
async def login_for_access_token(
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/users/")
async def create_user(email: str, password: str, name: str = None, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    hashed_password = get_password_hash(password)
    db_user = User(email=email, hashed_password=hashed_password, name=name)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    # Track signup event
    track_event(db, "user_signup", user_id=str(db_user.id))
    return {"message": "User created successfully", "id": str(db_user.id)}

# Feedback Endpoints
@app.post("/feedback/")
async def create_feedback(
    feedback: FeedbackCreate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    feedback_data = feedback.model_dump()
    feedback_data["recruiter_id"] = current_user  # Set recruiter from auth
    return add_feedback(db, feedback_data)

@app.get("/feedback/candidate/{candidate_id}")
async def read_feedback(
    candidate_id: str,
    db: Session = Depends(get_db)
):
    return get_feedback_for_candidate(db, candidate_id)

@app.post("/feedback/survey")
async def create_survey_feedback(
    feedback: dict,
    db: Session = Depends(get_db)
):
    return add_survey_feedback(db, feedback)

# Referral Leaderboard Endpoint (Day 68)
@app.get("/referrals/leaderboard")
async def get_referral_leaderboard(db: Session = Depends(get_db)):
    users = db.query(User).order_by(User.referrals_count.desc()).limit(10).all()
    return [
        {
            "rank": i + 1,
            "name": user.name or f"User {str(user.id)[:8]}",
            "referrals": user.referrals_count,
            "rewards": user.referral_rewards
        }
        for i, user in enumerate(users)
    ]
