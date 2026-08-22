from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from proofhire.backend.app.database import get_db
from proofhire.backend.app.contracts.recruiters import RecruiterCreate, RecruiterUpdate, Recruiter
from proofhire.backend.app.services.recruiter_service import recruiter_service

router = APIRouter()


@router.get("/", response_model=list[Recruiter])
def list_recruiters(organization_id: int, db: Session = Depends(get_db)):
    return recruiter_service.list_by_organization(db=db, organization_id=organization_id)


@router.post("/", response_model=Recruiter, status_code=status.HTTP_201_CREATED)
def create_recruiter(recruiter_in: RecruiterCreate, db: Session = Depends(get_db)):
    return recruiter_service.create(db=db, recruiter_in=recruiter_in)


@router.get("/{recruiter_id}", response_model=Recruiter)
def get_recruiter(recruiter_id: int, db: Session = Depends(get_db)):
    recruiter = recruiter_service.get(db=db, recruiter_id=recruiter_id)
    if not recruiter:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recruiter not found")
    return recruiter
