from typing import List

from backend.app.contracts.endorsements import EndorsementCreate
from backend.app.models.endorsement import Endorsement
from sqlalchemy.orm import Session


class EndorsementService:
    def list_by_candidate(self, db: Session, *, candidate_id: int) -> List[Endorsement]:
        return db.query(Endorsement).filter(Endorsement.candidate_id == candidate_id).all()

    def create(self, db: Session, *, endorsement_in: EndorsementCreate) -> Endorsement:
        db_obj = Endorsement(**endorsement_in.dict())
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


endorsement_service = EndorsementService()

