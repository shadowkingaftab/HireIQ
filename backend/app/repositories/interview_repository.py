from typing import List, Optional
from sqlalchemy.orm import Session
from proofhire.backend.app.repositories.base_repository import BaseRepository
from proofhire.backend.app.models.interview import Interview
from proofhire.backend.app.contracts.interviews import InterviewCreate, CoreModel # Using CoreModel as placeholder

class InterviewRepository(BaseRepository[Interview, InterviewCreate, Any]):
    def get_by_application(self, db: Session, *, application_id: int) -> List[Interview]:
        return db.query(Interview).filter(Interview.application_id == application_id).all()

interview_repository = InterviewRepository(Interview)
