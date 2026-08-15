from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from proofhire.backend.app.dependencies.database import get_db
from proofhire.backend.app.dependencies.auth import get_current_user
from proofhire.backend.app.repositories.candidate_repository import candidate_repository
from proofhire.backend.app.contracts.candidates import Candidate, CandidateCreate, CandidateUpdate
from proofhire.backend.app.models.user import User as UserModel

router = APIRouter()

@router.get("", response_model=List[Candidate])
def read_candidates(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: UserModel = Depends(get_current_active_superuser),
) -> Any:
    return candidate_repository.get_multi(db, skip=skip, limit=limit)

@router.get("/me", response_model=Candidate)
def read_candidate_me(
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
) -> Any:
    candidate = candidate_repository.get_by_user_id(db, user_id=current_user.id)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate profile not found")
    return candidate
