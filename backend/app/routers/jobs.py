from backend.app.contracts.jobs import Job, JobCreate
from backend.app.database import get_db
from backend.app.dependencies.auth import get_current_active_user
from backend.app.models.recruiter import Recruiter
from backend.app.models.user import User
from backend.app.services.job_service import job_service
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

router = APIRouter()


@router.get("/", response_model=list[Job])
def list_jobs(db: Session = Depends(get_db)):
    return job_service.list(db=db)


@router.post("/", response_model=Job, status_code=status.HTTP_201_CREATED)
def create_job(
    job_in: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    recruiter = db.query(Recruiter).filter(Recruiter.user_id == current_user.id).first()
    if recruiter is None or recruiter.organization_id != job_in.organization_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Recruiter access required for this organization")
    return job_service.create(db=db, job_in=job_in, recruiter_id=int(recruiter.id))


@router.get("/{job_id}", response_model=Job)
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = job_service.get(db=db, job_id=job_id)
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    return job

