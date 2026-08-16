from sqlalchemy.orm import Session
from proofhire.backend.app.repositories.base_repository import BaseRepository
from proofhire.backend.app.models.job import Job

class JobRepository(BaseRepository[Job]):
    def get_by_organization(self, db: Session, *, organization_id: int) -> list:
        return db.query(Job).filter(Job.organization_id == organization_id).all()


job_repository = JobRepository(Job)
