from sqlalchemy.orm import Session
from proofhire.backend.app.repositories.base_repository import BaseRepository
from proofhire.backend.app.models.endorsement import Endorsement

class EndorsementRepository(BaseRepository[Endorsement]):
    def list_by_candidate(self, db: Session, *, candidate_id: int) -> list:
        return db.query(Endorsement).filter(Endorsement.candidate_id == candidate_id).all()

endorsement_repository = EndorsementRepository(Endorsement)
