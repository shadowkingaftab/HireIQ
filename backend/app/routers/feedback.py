from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from proofhire.backend.app.database import get_db
from proofhire.backend.app.contracts.feedback import FeedbackCreate, Feedback
from proofhire.backend.app.services.feedback_service import feedback_service

router = APIRouter()


@router.get("/", response_model=list[Feedback])
def list_feedback(application_id: int, db: Session = Depends(get_db)):
    return feedback_service.list_by_application(db=db, application_id=application_id)


@router.post("/", response_model=Feedback, status_code=status.HTTP_201_CREATED)
def create_feedback(feedback_in: FeedbackCreate, db: Session = Depends(get_db)):
    return feedback_service.create(db=db, feedback_in=feedback_in)
