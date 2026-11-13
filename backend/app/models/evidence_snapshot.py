from backend.app.database import Base
from backend.app.models.base import TimestampMixin
from sqlalchemy import JSON, Column, DateTime, ForeignKey, Integer, func
from sqlalchemy.orm import relationship


class EvidenceSnapshot(Base, TimestampMixin):
    __tablename__ = "evidence_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    evidence_id = Column(Integer, ForeignKey("evidence.id", ondelete="CASCADE"), nullable=False)
    snapshot_data = Column(JSON, nullable=False)
    captured_at = Column(DateTime(timezone=True), server_default=func.now())

    evidence = relationship("Evidence", back_populates="snapshots")

