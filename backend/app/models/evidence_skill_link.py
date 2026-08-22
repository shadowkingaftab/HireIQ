from sqlalchemy import Column, Integer, ForeignKey, String, Float, DateTime
from sqlalchemy.orm import relationship
from proofhire.backend.app.database import Base
from proofhire.backend.app.models.base import TimestampMixin

class EvidenceSkillLink(Base, TimestampMixin):
    __tablename__ = "evidence_skill_links"

    id = Column(Integer, primary_key=True, index=True)
    evidence_id = Column(Integer, ForeignKey("evidence.id", ondelete="CASCADE"), nullable=False)
    skill_id = Column(String(100), ForeignKey("skills.id", ondelete="CASCADE"), nullable=False)
    proficiency_score = Column(Float)
    confidence_score = Column(Float)

    evidence = relationship("Evidence", back_populates="skill_links")
    skill = relationship("Skill")
