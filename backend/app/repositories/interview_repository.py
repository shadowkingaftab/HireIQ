from sqlalchemy.orm import Session
from proofhire.backend.app.repositories.base_repository import BaseRepository
from proofhire.backend.app.models.interview import Interview

class InterviewRepository(BaseRepository[Interview]):
    def list_by_application(self, db: Session, *, application_id: int) -> list:
        return db.query(Interview).filter(Interview.application_id == application_id).all()

interview_repository = InterviewRepository(Interview)
