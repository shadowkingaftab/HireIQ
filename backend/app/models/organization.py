from sqlalchemy import Column, Integer, String, Text, Boolean
from sqlalchemy.orm import relationship
from proofhire.backend.app.database import Base
from proofhire.backend.app.models.base import TimestampMixin

class Organization(Base, TimestampMixin):
    __tablename__ = "organizations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True, nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(Text)
    website = Column(String(255))
    logo_url = Column(String(512))
    is_active = Column(Boolean(), default=True)
    
    # Relationships
    members = relationship("OrganizationMember", back_populates="organization", cascade="all, delete-orphan")
    teams = relationship("Team", back_populates="organization", cascade="all, delete-orphan")
    jobs = relationship("Job", back_populates="organization")
    recruiters = relationship("Recruiter", back_populates="organization")
    assessments = relationship("Assessment", back_populates="organization")
    invitations = relationship("Invitation", back_populates="organization")
    integration_connections = relationship("IntegrationConnection", back_populates="organization")

    def __repr__(self):
        return f"<Organization(name={self.name}, slug={self.slug})>"
