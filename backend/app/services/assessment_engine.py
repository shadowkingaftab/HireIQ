from typing import List, Dict, Any
from sqlalchemy.orm import Session
from proofhire.backend.app.models.assessment import Assessment
from proofhire.backend.app.models.coding_session import CodingSession

class AssessmentEngine:
    def start_session(self, db: Session, *, assessment_id: int, candidate_id: int) -> CodingSession:
        session = CodingSession(
            assessment_id=assessment_id,
            candidate_id=candidate_id,
            status="started"
        )
        db.add(session)
        db.commit()
        db.refresh(session)
        return session

    def submit_session(self, db: Session, *, session_id: int, code: Dict[str, Any]) -> CodingSession:
        session = db.query(CodingSession).filter(CodingSession.id == session_id).first()
        session.code_snapshot = code
        session.status = "completed"
        # Logic to auto-grade could go here
        session.score = 85.0 
        db.commit()
        db.refresh(session)
        return session

assessment_engine = AssessmentEngine()
