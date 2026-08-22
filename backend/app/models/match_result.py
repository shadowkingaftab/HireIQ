from sqlalchemy import Column, Integer, ForeignKey, Float, JSON, Text
from sqlalchemy.orm import relationship
from proofhire.backend.app.database import Base
from proofhire.backend.app.models.base import TimestampMixin

class MatchResult(Base, TimestampMixin):
    __tablename__ = "match_results"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    candidate_id = Column(Integer, ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False)
    
    score = Column(Float, nullable=False, index=True)
    status = Column(String(50), default="calculated") # calculated, reviewed, dismissed
    
    # Relationships
    job = relationship("Job", back_populates="match_results")
    candidate = relationship("Candidate")
    explanation = relationship("MatchExplanation", back_populates="match_result", uselist=False, cascade="all, delete-orphan")

    def __repr__(self):
        return f"<MatchResult(job_id={self.job_id}, candidate_id={self.candidate_id}, score={self.score})>"

class MatchExplanation(Base, TimestampMixin):
    __tablename__ = "match_explanations"

    id = Column(Integer, primary_key=True, index=True)
    match_result_id = Column(Integer, ForeignKey("match_results.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    summary = Column(Text)
    matched_skills = Column(JSON) # List of skills that matched
    missing_skills = Column(JSON) # List of skills required but missing
    experience_fit = Column(Float)
    cultural_fit_score = Column(Float)
    ai_reasoning = Column(Text) # LLM generated reasoning
    
    # Relationships
    match_result = relationship("MatchResult", back_populates="explanation")

class Recommendation(Base, TimestampMixin):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    recruiter_id = Column(Integer, ForeignKey("recruiters.id"), nullable=False)
    candidate_id = Column(Integer, ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False)
    
    type = Column(String(50)) # system_generated, peer_referral
    strength = Column(Float)
    context = Column(Text)
    
    # Relationships
    candidate = relationship("Candidate")
    recruiter = relationship("Recruiter")
