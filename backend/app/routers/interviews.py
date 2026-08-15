from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from proofhire.backend.app.dependencies.database import get_db
from proofhire.backend.app.dependencies.auth import get_current_user
from proofhire.backend.app.repositories.interview_repository import interview_repository
from proofhire.backend.app.contracts.interviews import Interview, InterviewCreate
from proofhire.backend.app.models.user import User as UserModel

router = APIRouter()

@router.get("", response_model=List[Interview])
def read_interviews(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: UserModel = Depends(get_current_user),
) -> Any:
    return interview_repository.get_multi(db, skip=skip, limit=limit)

@router.post("", response_model=Interview)
def create_interview(
    *,
    db: Session = Depends(get_db),
    interview_in: InterviewCreate,
    current_user: UserModel = Depends(get_current_user),
) -> Any:
    return interview_repository.create(db, obj_in=interview_in)
