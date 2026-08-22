from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from proofhire.backend.app.database import get_db
from proofhire.backend.app.contracts.candidates import CandidateCreate, CandidateUpdate, Candidate
from proofhire.backend.app.services.candidate_service import candidate_service

router = APIRouter()


@router.get("/", response_model=list[Candidate])
def list_candidates(db: Session = Depends(get_db)):
    return candidate_service.list(db=db)


@router.post("/", response_model=Candidate, status_code=status.HTTP_201_CREATED)
def create_candidate(candidate_in: CandidateCreate, db: Session = Depends(get_db)):
    return candidate_service.create(db=db, candidate_in=candidate_in)


@router.get("/{candidate_id}", response_model=Candidate)
def get_candidate(candidate_id: int, db: Session = Depends(get_db)):
    candidate = candidate_service.get(db=db, candidate_id=candidate_id)
    if not candidate:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidate not found")
    return candidate
