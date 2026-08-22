from typing import List, Optional
from sqlalchemy.orm import Session
from proofhire.backend.app.models.evidence import Evidence, EvidenceSkillLink
from proofhire.backend.app.contracts.evidence import EvidenceCreate, EvidenceUpdate
from proofhire.backend.app.evidence.normalizer import normalizer
from proofhire.backend.app.evidence.validator import validator
from proofhire.backend.app.evidence.deduplicator import deduplicator
from proofhire.backend.app.evidence.aggregator import aggregator

class EvidenceService:
    def list_by_candidate(self, db: Session, *, candidate_id: int) -> List[Evidence]:
        return db.query(Evidence).filter(Evidence.candidate_id == candidate_id).all()

    def create(self, db: Session, *, candidate_id: int, evidence_in: EvidenceCreate) -> Evidence:
        if not validator.validate(evidence_data=evidence_in.dict()):
            raise ValueError("Invalid evidence data")
        db_obj = Evidence(**evidence_in.dict(), candidate_id=candidate_id)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, *, evidence_id: int, evidence_in: EvidenceUpdate) -> Optional[Evidence]:
        db_obj = db.query(Evidence).filter(Evidence.id == evidence_id).first()
        if not db_obj:
            return None
        for field, value in evidence_in.dict(exclude_unset=True).items():
            setattr(db_obj, field, value)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def aggregate_for_candidate(self, db: Session, *, candidate_id: int) -> dict:
        evidence_items = self.list_by_candidate(db=db, candidate_id=candidate_id)
        payloads = [{"source": e.type, "content": e.content, "verified": e.verified, "timestamp": e.created_at.isoformat() if e.created_at else None} for e in evidence_items]
        unique = deduplicator.find_duplicates(evidence_list=payloads)
        return aggregator.aggregate(evidence_list=unique)


evidence_service = EvidenceService()
