from backend.app.contracts.candidates import Candidate, CandidateCreate
from backend.app.database import get_db
from backend.app.dependencies.auth import get_current_active_user
from backend.app.models.user import User
from backend.app.services.candidate_service import candidate_service
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

router = APIRouter()


@router.get("/", response_model=list[Candidate])
def list_candidates(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if not current_user.is_superuser and current_user.recruiter_profile is None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Recruiter access required")
    return candidate_service.list(db=db)


@router.post("/", response_model=Candidate, status_code=status.HTTP_201_CREATED)
def create_candidate(
    candidate_in: CandidateCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    if candidate_in.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Candidates can only create their own profile")
    return candidate_service.create(db=db, candidate_in=candidate_in)


@router.get("/{candidate_id}", response_model=Candidate)
def get_candidate(
    candidate_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    candidate = candidate_service.get(db=db, candidate_id=candidate_id)
    if not candidate:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidate not found")
    if (
        candidate.user_id != current_user.id
        and current_user.recruiter_profile is None
        and not current_user.is_superuser
    ):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
    return candidate

