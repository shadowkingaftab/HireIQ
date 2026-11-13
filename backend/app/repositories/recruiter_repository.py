from backend.app.models.recruiter import Recruiter
from backend.app.repositories.base_repository import BaseRepository
from sqlalchemy.orm import Session


class RecruiterRepository(BaseRepository[Recruiter]):
    def get_by_organization(self, db: Session, *, organization_id: int) -> list:
        return db.query(Recruiter).filter(Recruiter.organization_id == organization_id).all()


recruiter_repository = RecruiterRepository(Recruiter)

