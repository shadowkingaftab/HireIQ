from typing import List, Optional
from sqlalchemy.orm import Session
from proofhire.backend.app.contracts.recruiters import RecruiterCreate, RecruiterUpdate
from proofhire.backend.app.models.recruiter import Recruiter

class RecruiterService:
    def list_by_organization(self, db: Session, *, organization_id: int) -> List[Recruiter]:
        return db.query(Recruiter).filter(Recruiter.organization_id == organization_id).all()

    def get(self, db: Session, *, recruiter_id: int) -> Optional[Recruiter]:
        return db.query(Recruiter).filter(Recruiter.id == recruiter_id).first()

    def create(self, db: Session, *, recruiter_in: RecruiterCreate) -> Recruiter:
        db_obj = Recruiter(**recruiter_in.dict())
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


recruiter_service = RecruiterService()
