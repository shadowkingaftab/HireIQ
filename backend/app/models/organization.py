from backend.app.database import Base
from backend.app.models.base import TimestampMixin
from sqlalchemy import Boolean, Column, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship


class Organization(Base, TimestampMixin):
    __tablename__ = "organizations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True, nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(Text)
    website = Column(String(255))
    logo_url = Column(String(512))
    is_active: Mapped[bool] = mapped_column(Boolean(), default=True)
    
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

