from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from proofhire.backend.app.database import get_db
from proofhire.backend.app.contracts.jobs import JobCreate, JobUpdate, Job
from proofhire.backend.app.services.job_service import job_service

router = APIRouter()


@router.get("/", response_model=list[Job])
def list_jobs(db: Session = Depends(get_db)):
    return job_service.list(db=db)


@router.post("/", response_model=Job, status_code=status.HTTP_201_CREATED)
def create_job(job_in: JobCreate, db: Session = Depends(get_db)):
    return job_service.create(db=db, job_in=job_in)


@router.get("/{job_id}", response_model=Job)
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = job_service.get(db=db, job_id=job_id)
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    return job
