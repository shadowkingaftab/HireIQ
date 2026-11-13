from backend.app.models.job import Job
from backend.app.repositories.base_repository import BaseRepository
from sqlalchemy.orm import Session


class JobRepository(BaseRepository[Job]):
    def get_by_organization(self, db: Session, *, organization_id: int) -> list:
        return db.query(Job).filter(Job.organization_id == organization_id).all()


job_repository = JobRepository(Job)

