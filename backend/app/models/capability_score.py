from backend.app.database import Base
from backend.app.models.base import TimestampMixin
from sqlalchemy import JSON, Column, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship


class CapabilityScore(Base, TimestampMixin):
    __tablename__ = "capability_scores"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False)
    capability_name = Column(String(100), nullable=False) # e.g., "Backend Development"
    
    score = Column(Float, nullable=False)
    confidence = Column(Float)
    breakdown = Column(JSON) # How the score was calculated
    
    version_id = Column(Integer, ForeignKey("score_versions.id"))
    
    # Relationships
    candidate = relationship("Candidate", back_populates="capability_scores")
    version = relationship("ScoreVersion")

    def __repr__(self):
        return f"<CapabilityScore(candidate_id={self.candidate_id}, capability={self.capability_name}, score={self.score})>"

