from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from proofhire.backend.app.database import get_db
from proofhire.backend.app.contracts.assessments import AssessmentCreate, AssessmentUpdate, Assessment
from proofhire.backend.app.services.assessment_engine import assessment_engine

router = APIRouter()


@router.get("/", response_model=list[Assessment])
def list_assessments(db: Session = Depends(get_db)):
    return assessment_engine.list(db=db)


@router.post("/", response_model=Assessment, status_code=status.HTTP_201_CREATED)
def create_assessment(assessment_in: AssessmentCreate, db: Session = Depends(get_db)):
    return assessment_engine.create(db=db, assessment_in=assessment_in)


@router.get("/{assessment_id}", response_model=Assessment)
def get_assessment(assessment_id: int, db: Session = Depends(get_db)):
    assessment = assessment_engine.get(db=db, assessment_id=assessment_id)
    if not assessment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assessment not found")
    return assessment
