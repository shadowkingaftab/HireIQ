from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, JSON, Float
from sqlalchemy.orm import relationship
from proofhire.backend.app.database import Base
from proofhire.backend.app.models.base import TimestampMixin

class CodingSession(Base, TimestampMixin):
    __tablename__ = "coding_sessions"

    id = Column(Integer, primary_key=True, index=True)
    session_token = Column(String(255), unique=True, index=True)
    
    assessment_id = Column(Integer, ForeignKey("assessments.id", ondelete="CASCADE"), nullable=False)
    candidate_id = Column(Integer, ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False)
    
    status = Column(String(50), default="started") # started, completed, timed_out
    started_at = Column(DateTime(timezone=True))
    completed_at = Column(DateTime(timezone=True))
    
    code_snapshot = Column(JSON) # Final code submission
    score = Column(Float)
    
    # Relationships
    assessment = relationship("Assessment", back_populates="coding_sessions")
    candidate = relationship("Candidate")

    def __repr__(self):
        return f"<CodingSession(candidate_id={self.candidate_id}, status={self.status})>"
