from sqlalchemy import Column, Integer, Text, ForeignKey, Enum, Float, JSON
from sqlalchemy.orm import relationship
from proofhire.backend.app.database import Base
from proofhire.backend.app.models.base import TimestampMixin
from proofhire.backend.app.core.constants import ApplicationStatus

class Application(Base, TimestampMixin):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    status = Column(Enum(ApplicationStatus), default=ApplicationStatus.APPLIED, nullable=False)
    cover_letter = Column(Text)
    
    # Matching and scoring
    matching_score = Column(Float)
    score_details = Column(JSON) # Breakdown of the score
    
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    candidate_id = Column(Integer, ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False)
    
    # Relationships
    job = relationship("Job", back_populates="applications")
    candidate = relationship("Candidate", back_populates="applications")
    feedbacks = relationship("Feedback", back_populates="application", cascade="all, delete-orphan")
    interviews = relationship("Interview", back_populates="application", cascade="all, delete-orphan")
    notes = relationship("CandidateNote", back_populates="application", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Application(job_id={self.job_id}, candidate_id={self.candidate_id}, status={self.status})>"
