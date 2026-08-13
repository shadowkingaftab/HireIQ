from sqlalchemy import Column, Integer, String, Text, ForeignKey, Enum, JSON
from sqlalchemy.orm import relationship
from proofhire.backend.app.database import Base
from proofhire.backend.app.models.base import TimestampMixin
from proofhire.backend.app.core.constants import JobStatus

class Job(Base, TimestampMixin):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=False)
    requirements = Column(Text)
    location = Column(String(255))
    salary_min = Column(Integer)
    salary_max = Column(Integer)
    status = Column(Enum(JobStatus), default=JobStatus.DRAFT, nullable=False)
    
    # Metadata for matching
    ideal_skills = Column(JSON, default=list) # List of skill IDs
    importance_weights = Column(JSON, default=dict) # Weight per skill/category
    
    organization_id = Column(Integer, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    recruiter_id = Column(Integer, ForeignKey("recruiters.id"), nullable=False)
    
    # Relationships
    organization = relationship("Organization", back_populates="jobs")
    recruiter = relationship("Recruiter", back_populates="jobs")
    applications = relationship("Application", back_populates="job", cascade="all, delete-orphan")
    match_results = relationship("MatchResult", back_populates="job", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Job(title={self.title}, status={self.status})>"
