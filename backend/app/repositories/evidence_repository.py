from typing import List, Optional
from sqlalchemy.orm import Session
from proofhire.backend.app.repositories.base_repository import BaseRepository
from proofhire.backend.app.models.evidence import Evidence
from proofhire.backend.app.contracts.evidence import EvidenceCreate, CoreModel

class EvidenceRepository(BaseRepository[Evidence, EvidenceCreate, Any]):
    def get_by_candidate(self, db: Session, *, candidate_id: int) -> List[Evidence]:
        return db.query(Evidence).filter(Evidence.candidate_id == candidate_id).all()

evidence_repository = EvidenceRepository(Evidence)
