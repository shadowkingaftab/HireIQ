from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from proofhire.backend.app.database import get_db
from proofhire.backend.app.contracts.endorsements import EndorsementCreate, Endorsement
from proofhire.backend.app.services.endorsement_service import endorsement_service

router = APIRouter()


@router.get("/candidates/{candidate_id}", response_model=list[Endorsement])
def list_endorsements(candidate_id: int, db: Session = Depends(get_db)):
    return endorsement_service.list_by_candidate(db=db, candidate_id=candidate_id)


@router.post("/", response_model=Endorsement, status_code=status.HTTP_201_CREATED)
def create_endorsement(endorsement_in: EndorsementCreate, db: Session = Depends(get_db)):
    return endorsement_service.create(db=db, endorsement_in=endorsement_in)
