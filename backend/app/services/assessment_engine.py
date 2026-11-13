from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from backend.app.contracts.assessments import AssessmentCreate
from backend.app.models.assessment import Assessment
from backend.app.models.coding_session import CodingSession
from sqlalchemy.orm import Session


class AssessmentEngine:
    def create(self, db: Session, *, assessment_in: AssessmentCreate) -> Assessment:
        values = assessment_in.model_dump() if hasattr(assessment_in, "model_dump") else assessment_in.dict()
        assessment = Assessment(**values)
        db.add(assessment)
        db.commit()
        db.refresh(assessment)
        return assessment

    def get(self, db: Session, *, assessment_id: int) -> Optional[Assessment]:
        return db.query(Assessment).filter(Assessment.id == assessment_id).first()

    def start_session(self, db: Session, *, assessment_id: int, candidate_id: int) -> CodingSession:
        session = CodingSession(
            assessment_id=assessment_id,
            candidate_id=candidate_id,
            status="started",
            started_at=datetime.now(timezone.utc),
        )
        db.add(session)
        db.commit()
        db.refresh(session)
        return session

    def submit_session(self, db: Session, *, session_id: int, code: Dict[str, Any]) -> CodingSession:
        session = db.query(CodingSession).filter(CodingSession.id == session_id).first()
        if session is None:
            raise ValueError("Assessment session not found")
        setattr(session, "code_snapshot", code)
        setattr(session, "status", "submitted")
        setattr(session, "completed_at", datetime.now(timezone.utc))
        # The project has no isolated grader configured, so submissions remain
        # ungraded instead of receiving a fabricated score.
        setattr(session, "score", None)
        db.commit()
        db.refresh(session)
        return session

    def list(self, db: Session) -> List[Assessment]:
        return db.query(Assessment).all()

assessment_engine = AssessmentEngine()


