from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from proofhire.backend.app.database import get_db
from proofhire.backend.app.contracts.evidence import EvidenceCreate, EvidenceUpdate, Evidence
from proofhire.backend.app.services.evidence_service import evidence_service

router = APIRouter()


@router.get("/candidates/{candidate_id}", response_model=list[Evidence])
def list_evidence(candidate_id: int, db: Session = Depends(get_db)):
    return evidence_service.list_by_candidate(db=db, candidate_id=candidate_id)


@router.post("/candidates/{candidate_id}", response_model=Evidence, status_code=status.HTTP_201_CREATED)
def create_evidence(candidate_id: int, evidence_in: EvidenceCreate, db: Session = Depends(get_db)):
    return evidence_service.create(db=db, candidate_id=candidate_id, evidence_in=evidence_in)


@router.patch("/{evidence_id}", response_model=Evidence)
def update_evidence(evidence_id: int, evidence_in: EvidenceUpdate, db: Session = Depends(get_db)):
    evidence = evidence_service.update(db=db, evidence_id=evidence_id, evidence_in=evidence_in)
    if not evidence:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Evidence not found")
    return evidence
