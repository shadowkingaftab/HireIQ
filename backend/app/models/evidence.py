from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON, Boolean, DateTime
from sqlalchemy.orm import relationship
from proofhire.backend.app.database import Base
from proofhire.backend.app.models.base import TimestampMixin

class Evidence(Base, TimestampMixin):
    __tablename__ = "evidence"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False)
    source_id = Column(Integer, ForeignKey("evidence_sources.id"))
    
    type = Column(String(50), nullable=False) # github_repo, stackoverflow_answer, assessment_result
    title = Column(String(255))
    description = Column(Text)
    url = Column(String(512))
    
    content = Column(JSON) # Raw data
    verified = Column(Boolean, default=False)
    verification_method = Column(String(50))
    
    # Relationships
    candidate = relationship("Candidate", back_populates="evidence")
    source = relationship("EvidenceSource", back_populates="evidence")
    skill_links = relationship("EvidenceSkillLink", back_populates="evidence", cascade="all, delete-orphan")
    snapshots = relationship("EvidenceSnapshot", back_populates="evidence", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Evidence(type={self.type}, title={self.title})>"

class EvidenceSource(Base, TimestampMixin):
    __tablename__ = "evidence_sources"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False) # GitHub, LinkedIn, InternalAssessment
    base_url = Column(String(255))
    is_active = Column(Boolean, default=True)
    
    # Relationships
    evidence = relationship("Evidence", back_populates="source")

class EvidenceSkillLink(Base, TimestampMixin):
    __tablename__ = "evidence_skill_links"

    id = Column(Integer, primary_key=True, index=True)
    evidence_id = Column(Integer, ForeignKey("evidence.id", ondelete="CASCADE"), nullable=False)
    skill_id = Column(String(100), ForeignKey("skills.id", ondelete="CASCADE"), nullable=False)
    
    proficiency_score = Column(Float) # Extracted proficiency from this specific evidence
    confidence_score = Column(Float)
    
    # Relationships
    evidence = relationship("Evidence", back_populates="skill_links")
    skill = relationship("Skill")

class EvidenceSnapshot(Base, TimestampMixin):
    __tablename__ = "evidence_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    evidence_id = Column(Integer, ForeignKey("evidence.id", ondelete="CASCADE"), nullable=False)
    snapshot_data = Column(JSON, nullable=False)
    captured_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    evidence = relationship("Evidence", back_populates="snapshots")
