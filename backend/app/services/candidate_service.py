from typing import List, Optional

from backend.app.contracts.candidates import CandidateCreate, CandidateUpdate
from backend.app.models.candidate import Candidate
from backend.app.repositories.candidate_repository import candidate_repository
from sqlalchemy.orm import Session


class CandidateService:
    def list(self, db: Session) -> List[Candidate]:
        return candidate_repository.list(db)

    def create(self, db: Session, *, candidate_in: CandidateCreate) -> Candidate:
        values = candidate_in.model_dump() if hasattr(candidate_in, "model_dump") else candidate_in.dict()
        values["skills_data"] = {"skills": values.pop("skills", [])}
        return candidate_repository.create(db, obj_in=values)

    def get(self, db: Session, *, candidate_id: int) -> Optional[Candidate]:
        return candidate_repository.get(db, id=candidate_id)

    def get_or_create(self, db: Session, *, user_id: int) -> Candidate:
        candidate = candidate_repository.get_by_user_id(
            db,
            user_id=user_id,
        )
        if not candidate:
            candidate = candidate_repository.create(
                db,
                obj_in=CandidateCreate(user_id=user_id),
            )
        return candidate

    def update_profile(
        self,
        db: Session,
        *,
        candidate_id: int,
        profile_in: CandidateUpdate,
    ) -> Candidate:
        db_obj = candidate_repository.get(db, id=candidate_id)
        if db_obj is None:
            raise ValueError("Candidate not found")
        return candidate_repository.update(
            db,
            db_obj=db_obj,
            obj_in=profile_in,
        )

    def update(self, db: Session, *, candidate_id: int, candidate_in: CandidateUpdate) -> Optional[Candidate]:
        db_obj = self.get(db, candidate_id=candidate_id)
        if db_obj is None:
            return None
        values = candidate_in.model_dump(exclude_unset=True) if hasattr(candidate_in, "model_dump") else candidate_in.dict(exclude_unset=True)
        if "skills" in values:
            values["skills_data"] = {"skills": values.pop("skills") or []}
        return candidate_repository.update(db, db_obj=db_obj, obj_in=values)


candidate_service = CandidateService()
