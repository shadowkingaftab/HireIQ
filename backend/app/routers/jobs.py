import io
import magic
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from typing import List
import uuid

from .. import database
from ..models.job import Job
from ..schemas import JobCreate, JobResponse, JDInput
from ..services.resume_parser import parse_resume
from ..services.jd_parser import parse_jd
from ..services.analytics_service import track_event, track_funnel_step

router = APIRouter(
    tags=["jobs"]
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/jobs/", response_model=JobResponse)
def create_job(job: JobCreate, db: Session = Depends(get_db)):
    db_job = Job(**job.model_dump())
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

@router.get("/jobs/", response_model=List[JobResponse])
def read_jobs(db: Session = Depends(get_db)):
    return db.query(Job).all()

@router.post("/parse-resume/")
async def parse_resume_endpoint(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    contents = await file.read()
    
    mime = magic.Magic(mime=True)
    mime_type = mime.from_buffer(contents)
    if mime_type != 'application/pdf':
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDF files are allowed.")
    
    pdf_file = io.BytesIO(contents)
    
    try:
        result = parse_resume(pdf_file)
        track_event(db, "resume_uploaded", event_metadata={
            "skills_count": len(result.get("skills", []))
        })
        track_funnel_step(db, "resume_uploaded", "main")
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error parsing resume: {str(e)}")

@router.post("/parse-jd/")
async def parse_jd_endpoint(jd_input: JDInput, db: Session = Depends(get_db)):
    try:
        result = parse_jd(jd_input.text)
        track_funnel_step(db, "jd_pasted", "main")
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error parsing JD: {str(e)}")
