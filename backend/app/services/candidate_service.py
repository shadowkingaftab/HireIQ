from typing import List, Optional
from sqlalchemy.orm import Session
from proofhire.backend.app.repositories.candidate_repository import candidate_repository
from proofhire.backend.app.contracts.candidates import CandidateCreate, CandidateUpdate
from proofhire.backend.app.models.candidate import Candidate

class CandidateService:
    def get_or_create(self, db: Session, *, user_id: int) -> Candidate:
        candidate = candidate_repository.get_by_user_id(db, user_id=user_id)
        if not candidate:
            candidate = candidate_repository.create(db, obj_in=CandidateCreate(user_id=user_id))
        return candidate

    def update_profile(self, db: Session, *, candidate_id: int, profile_in: CandidateUpdate) -> Candidate:
        db_obj = candidate_repository.get(db, id=candidate_id)
        return candidate_repository.update(db, db_obj=db_obj, obj_in=profile_in)

candidate_service = CandidateService()
