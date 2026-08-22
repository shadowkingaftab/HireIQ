from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from proofhire.backend.app.database import Base
from proofhire.backend.app.models.base import TimestampMixin

class Candidate(Base, TimestampMixin):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    summary = Column(Text)
    resume_url = Column(String(512))
    github_url = Column(String(512))
    linkedin_url = Column(String(512))
    portfolio_url = Column(String(512))
    
    # Aggregated skill data
    skills_data = Column(JSON, default=dict) # Aggregated skills and proficiency
    
    # Relationships
    user = relationship("User", back_populates="candidate_profile")
    applications = relationship("Application", back_populates="candidate", cascade="all, delete-orphan")
    evidence = relationship("Evidence", back_populates="candidate", cascade="all, delete-orphan")
    endorsements = relationship("Endorsement", back_populates="candidate", cascade="all, delete-orphan")
    notes = relationship("CandidateNote", back_populates="candidate", cascade="all, delete-orphan")
    external_accounts = relationship("ExternalAccount", back_populates="candidate", cascade="all, delete-orphan")
    capability_scores = relationship("CapabilityScore", back_populates="candidate", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Candidate(user_id={self.user_id})>"
