from sqlalchemy.orm import Session
from proofhire.backend.app.repositories.base_repository import BaseRepository
from proofhire.backend.app.models.feedback import Feedback

class FeedbackRepository(BaseRepository[Feedback]):
    def list_by_application(self, db: Session, *, application_id: int) -> list:
        return db.query(Feedback).filter(Feedback.application_id == application_id).all()

feedback_repository = FeedbackRepository(Feedback)
