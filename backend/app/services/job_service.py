from typing import List, Optional
from sqlalchemy.orm import Session
from proofhire.backend.app.repositories.job_repository import job_repository
from proofhire.backend.app.contracts.jobs import JobCreate, JobUpdate
from proofhire.backend.app.models.job import Job

class JobService:
    def create(self, db: Session, *, job_in: JobCreate, recruiter_id: int) -> Job:
        # Additional logic for job initialization
        db_obj = Job(**job_in.dict(), recruiter_id=recruiter_id)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def list_by_org(self, db: Session, *, organization_id: int) -> List[Job]:
        return job_repository.get_by_organization(db, organization_id=organization_id)

job_service = JobService()
