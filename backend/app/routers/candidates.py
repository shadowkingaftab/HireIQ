from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid

from .. import database
from ..models.candidate import Candidate
from ..schemas import CandidateCreate, CandidateResponse

router = APIRouter(
    prefix="/candidates",
    tags=["candidates"]
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=CandidateResponse)
def create_candidate(candidate: CandidateCreate, db: Session = Depends(get_db)):
    db_candidate = Candidate(**candidate.model_dump())
    db.add(db_candidate)
    db.commit()
    db.refresh(db_candidate)
    return db_candidate

@router.get("/", response_model=List[CandidateResponse])
def read_candidates(db: Session = Depends(get_db)):
    return db.query(Candidate).all()

@router.get("/{candidate_id}", response_model=CandidateResponse)
def read_candidate(candidate_id: uuid.UUID, db: Session = Depends(get_db)):
    db_candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if db_candidate is None:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return db_candidate
