from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from proofhire.backend.app.dependencies.database import get_db
from proofhire.backend.app.dependencies.auth import get_current_user
from proofhire.backend.app.repositories.job_repository import job_repository
from proofhire.backend.app.contracts.jobs import Job, JobCreate, JobUpdate
from proofhire.backend.app.models.user import User as UserModel

router = APIRouter()

@router.get("", response_model=List[Job])
def read_jobs(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: UserModel = Depends(get_current_user),
) -> Any:
    return job_repository.get_multi(db, skip=skip, limit=limit)

@router.post("", response_model=Job)
def create_job(
    *,
    db: Session = Depends(get_db),
    job_in: JobCreate,
    current_user: UserModel = Depends(get_current_user),
) -> Any:
    # Logic to check if user belongs to the org would go here
    return job_repository.create(db, obj_in=job_in)

@router.get("/{job_id}", response_model=Job)
def read_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
) -> Any:
    job = job_repository.get(db, id=job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job
