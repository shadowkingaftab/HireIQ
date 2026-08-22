from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from proofhire.backend.app.database import Base
from proofhire.backend.app.models.base import TimestampMixin

class Recruiter(Base, TimestampMixin):
    __tablename__ = "recruiters"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    organization_id = Column(Integer, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    
    title = Column(String(255)) # Job title within the org
    department = Column(String(255))
    
    # Relationships
    user = relationship("User", back_populates="recruiter_profile")
    organization = relationship("Organization", back_populates="recruiters")
    jobs = relationship("Job", back_populates="recruiter")
    preferences = relationship("RecruiterPreferences", back_populates="recruiter", uselist=False, cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Recruiter(user_id={self.user_id}, org_id={self.organization_id})>"
