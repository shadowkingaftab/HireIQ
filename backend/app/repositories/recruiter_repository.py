from typing import List, Optional
from sqlalchemy.orm import Session
from proofhire.backend.app.repositories.base_repository import BaseRepository
from proofhire.backend.app.models.recruiter import Recruiter
from proofhire.backend.app.contracts.recruiters import RecruiterCreate, RecruiterUpdate

class RecruiterRepository(BaseRepository[Recruiter, RecruiterCreate, RecruiterUpdate]):
    def get_by_user_id(self, db: Session, *, user_id: int) -> Optional[Recruiter]:
        return db.query(Recruiter).filter(Recruiter.user_id == user_id).first()

    def get_by_organization(self, db: Session, *, organization_id: int) -> List[Recruiter]:
        return db.query(Recruiter).filter(Recruiter.organization_id == organization_id).all()

recruiter_repository = RecruiterRepository(Recruiter)
