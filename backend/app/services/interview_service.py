from typing import List, Optional
from sqlalchemy.orm import Session
from proofhire.backend.app.contracts.interviews import InterviewCreate, InterviewUpdate
from proofhire.backend.app.models.interview import Interview

class InterviewService:
    def list_by_application(self, db: Session, *, application_id: int) -> List[Interview]:
        return db.query(Interview).filter(Interview.application_id == application_id).all()

    def create(self, db: Session, *, interview_in: InterviewCreate) -> Interview:
        db_obj = Interview(**interview_in.dict())
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, *, interview_id: int, interview_in: InterviewUpdate) -> Optional[Interview]:
        db_obj = db.query(Interview).filter(Interview.id == interview_id).first()
        if not db_obj:
            return None
        for field, value in interview_in.dict(exclude_unset=True).items():
            setattr(db_obj, field, value)
        db.commit()
        db.refresh(db_obj)
        return db_obj


interview_service = InterviewService()
