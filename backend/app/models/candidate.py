from backend.app.database import Base
from backend.app.models.base import TimestampMixin
from sqlalchemy import JSON, Column, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship


class Candidate(Base, TimestampMixin):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)

    summary = Column(Text)
    resume_url = Column(String(512))
    github_url = Column(String(512))
    linkedin_url = Column(String(512))
    portfolio_url = Column(String(512))

    skills_data = Column(JSON, default=dict)

    user = relationship("User", back_populates="candidate_profile")
    applications = relationship("Application", back_populates="candidate", cascade="all, delete-orphan")
    evidence = relationship("Evidence", back_populates="candidate", cascade="all, delete-orphan")
    endorsements = relationship("Endorsement", back_populates="candidate", cascade="all, delete-orphan")
    notes = relationship("CandidateNote", back_populates="candidate", cascade="all, delete-orphan")
    external_accounts = relationship("ExternalAccount", back_populates="candidate", cascade="all, delete-orphan")
    capability_scores = relationship("CapabilityScore", back_populates="candidate", cascade="all, delete-orphan")
    portfolios = relationship("Portfolio", back_populates="candidate", cascade="all, delete-orphan")

    @property
    def skills(self):
        data = self.skills_data or {}
        if isinstance(data, dict):
            return data.get("skills", list(data.keys()))
        return data

    def __repr__(self):
        return f"<Candidate(user_id={self.user_id})>"
