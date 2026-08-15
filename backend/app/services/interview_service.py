from typing import List, Optional
from sqlalchemy.orm import Session
from proofhire.backend.app.models.interview import Interview

class InterviewService:
    def schedule_interview(self, db: Session, *, application_id: int, scheduled_at: str, location: str) -> Interview:
        interview = Interview(
            application_id=application_id,
            scheduled_at=scheduled_at,
            location=location,
            status="scheduled"
        )
        db.add(interview)
        db.commit()
        db.refresh(interview)
        return interview

interview_service = InterviewService()
