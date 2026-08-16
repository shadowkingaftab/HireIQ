from sqlalchemy.orm import Session
from proofhire.backend.app.repositories.base_repository import BaseRepository
from proofhire.backend.app.models.recruiter import Recruiter

class RecruiterRepository(BaseRepository[Recruiter]):
    def get_by_organization(self, db: Session, *, organization_id: int) -> list:
        return db.query(Recruiter).filter(Recruiter.organization_id == organization_id).all()


recruiter_repository = RecruiterRepository(Recruiter)
