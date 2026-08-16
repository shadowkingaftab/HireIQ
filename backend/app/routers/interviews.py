from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from proofhire.backend.app.database import get_db
from proofhire.backend.app.contracts.interviews import InterviewCreate, InterviewUpdate, Interview
from proofhire.backend.app.services.interview_service import interview_service

router = APIRouter()


@router.get("/", response_model=list[Interview])
def list_interviews(application_id: int, db: Session = Depends(get_db)):
    return interview_service.list_by_application(db=db, application_id=application_id)


@router.post("/", response_model=Interview, status_code=status.HTTP_201_CREATED)
def create_interview(interview_in: InterviewCreate, db: Session = Depends(get_db)):
    return interview_service.create(db=db, interview_in=interview_in)


@router.patch("/{interview_id}", response_model=Interview)
def update_interview(interview_id: int, interview_in: InterviewUpdate, db: Session = Depends(get_db)):
    interview = interview_service.update(db=db, interview_id=interview_id, interview_in=interview_in)
    if not interview:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Interview not found")
    return interview
