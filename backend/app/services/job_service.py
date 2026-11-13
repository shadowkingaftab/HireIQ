from typing import List, Optional

from backend.app.contracts.jobs import JobCreate
from backend.app.models.job import Job
from backend.app.repositories.job_repository import job_repository
from sqlalchemy.orm import Session


class JobService:
    def create(self, db: Session, *, job_in: JobCreate, recruiter_id: int) -> Job:
        db_obj = Job(**job_in.dict(), recruiter_id=recruiter_id)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def list(self, db: Session) -> List[Job]:
        return job_repository.list(db)

    def get(self, db: Session, *, job_id: int) -> Optional[Job]:
        return job_repository.get(db, id=job_id)

    def list_by_org(self, db: Session, *, organization_id: int) -> List[Job]:
        return job_repository.get_by_organization(
            db,
            organization_id=organization_id,
        )


job_service = JobService()
