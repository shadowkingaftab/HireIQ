from sqlalchemy.orm import Session
from proofhire.backend.app.repositories.base_repository import BaseRepository
from proofhire.backend.app.models.evidence import Evidence

class EvidenceRepository(BaseRepository[Evidence]):
    def list_by_candidate(self, db: Session, *, candidate_id: int) -> list:
        return db.query(Evidence).filter(Evidence.candidate_id == candidate_id).all()


evidence_repository = EvidenceRepository(Evidence)
