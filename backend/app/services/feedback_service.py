from typing import List, Optional
from sqlalchemy.orm import Session
from proofhire.backend.app.contracts.feedback import FeedbackCreate
from proofhire.backend.app.models.feedback import Feedback

class FeedbackService:
    def list_by_application(self, db: Session, *, application_id: int) -> List[Feedback]:
        return db.query(Feedback).filter(Feedback.application_id == application_id).all()

    def create(self, db: Session, *, feedback_in: FeedbackCreate) -> Feedback:
        db_obj = Feedback(**feedback_in.dict())
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


feedback_service = FeedbackService()
