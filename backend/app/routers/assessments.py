from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from proofhire.backend.app.dependencies.database import get_db
from proofhire.backend.app.dependencies.auth import get_current_user
from proofhire.backend.app.repositories.assessment_repository import assessment_repository
from proofhire.backend.app.contracts.assessments import Assessment, AssessmentCreate, AssessmentUpdate
from proofhire.backend.app.models.user import User as UserModel

router = APIRouter()

@router.get("", response_model=List[Assessment])
def read_assessments(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: UserModel = Depends(get_current_user),
) -> Any:
    return assessment_repository.get_multi(db, skip=skip, limit=limit)

@router.post("", response_model=Assessment)
def create_assessment(
    *,
    db: Session = Depends(get_db),
    assessment_in: AssessmentCreate,
    current_user: UserModel = Depends(get_current_user),
) -> Any:
    return assessment_repository.create(db, obj_in=assessment_in)
