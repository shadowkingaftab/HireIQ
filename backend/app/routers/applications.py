from backend.app.contracts.applications import (
    Application,
    ApplicationCreate,
    ApplicationUpdate,
)
from backend.app.core.constants import ApplicationStatus, JobStatus
from backend.app.database import get_db
from backend.app.dependencies.auth import get_current_active_user
from backend.app.models.candidate import Candidate
from backend.app.models.job import Job
from backend.app.models.user import User
from backend.app.services.application_service import application_service
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

router = APIRouter()


@router.get("/", response_model=list[Application])
def list_applications(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)
):
    if current_user.is_superuser:
        return application_service.list(db=db)
    if current_user.recruiter_profile is not None:
        return application_service.list_for_recruiter(
            db, recruiter_id=int(current_user.recruiter_profile.id)
        )
    if current_user.candidate_profile is not None:
        return application_service.list_for_candidate(
            db, candidate_id=int(current_user.candidate_profile.id)
        )
    return []


@router.post("/", response_model=Application, status_code=status.HTTP_201_CREATED)
def create_application(
    app_in: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    candidate = db.query(Candidate).filter(Candidate.id == app_in.candidate_id).first()
    if candidate is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidate not found")
    if candidate.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Candidates can only apply for themselves")
    job = db.query(Job).filter(Job.id == app_in.job_id).first()
    if job is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    if job.status != JobStatus.OPEN:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Job is not accepting applications")
    return application_service.create(db=db, app_in=app_in)


@router.patch("/{application_id}", response_model=Application)
def update_application(
    application_id: int,
    app_in: ApplicationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    existing = application_service.get(db, application_id=application_id)
    if existing is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    recruiter_owns_job = (
        current_user.recruiter_profile is not None
        and existing.job.recruiter_id == current_user.recruiter_profile.id
    )
    candidate_owns_application = (
        current_user.candidate_profile is not None
        and existing.candidate_id == current_user.candidate_profile.id
    )
    withdrawing = app_in.status == ApplicationStatus.WITHDRAWN
    if not (current_user.is_superuser or recruiter_owns_job or (candidate_owns_application and withdrawing)):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
    app = application_service.update(db=db, application_id=application_id, app_in=app_in)
    if not app:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    return app

