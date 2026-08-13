from typing import List, Optional
from sqlalchemy.orm import Session
from proofhire.backend.app.repositories.base_repository import BaseRepository
from proofhire.backend.app.models.job import Job
from proofhire.backend.app.contracts.jobs import JobCreate, JobUpdate

class JobRepository(BaseRepository[Job, JobCreate, JobUpdate]):
    def get_by_organization(
        self, db: Session, *, organization_id: int, skip: int = 0, limit: int = 100
    ) -> List[Job]:
        return (
            db.query(Job)
            .filter(Job.organization_id == organization_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

job_repository = JobRepository(Job)
