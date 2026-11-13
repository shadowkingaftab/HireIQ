from backend.app.database import Base
from backend.app.models.base import TimestampMixin
from sqlalchemy import JSON, Boolean, Column, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship


class Evidence(Base, TimestampMixin):
    __tablename__ = "evidence"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(
        Integer,
        ForeignKey("candidates.id", ondelete="CASCADE"),
        nullable=False,
    )
    source_id = Column(
        Integer,
        ForeignKey("evidence_sources.id"),
    )

    type = Column(String(50), nullable=False)
    title = Column(String(255))
    description = Column(Text)
    url = Column(String(512))

    content = Column(JSON)
    verified = Column(Boolean, default=False)
    verification_method = Column(String(50))

    candidate = relationship("Candidate", back_populates="evidence")
    source = relationship("EvidenceSource", back_populates="evidence")
    skill_links = relationship(
        "EvidenceSkillLink",
        back_populates="evidence",
        cascade="all, delete-orphan",
    )
    snapshots = relationship(
        "EvidenceSnapshot",
        back_populates="evidence",
        cascade="all, delete-orphan",
    )

    def __repr__(self):
        return f"<Evidence(type={self.type}, title={self.title})>"
