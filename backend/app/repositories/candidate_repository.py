from typing import Optional
from sqlalchemy.orm import Session
from backend.app.repositories.base_repository import BaseRepository
from backend.app.models.candidate import Candidate

class CandidateRepository(BaseRepository[Candidate]):
    def get_by_user_id(self, db: Session, *, user_id: int) -> Optional[Candidate]:
        return db.query(Candidate).filter(Candidate.user_id == user_id).first()


candidate_repository = CandidateRepository(Candidate)


