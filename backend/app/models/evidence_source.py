from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from proofhire.backend.app.database import Base
from proofhire.backend.app.models.base import TimestampMixin

class EvidenceSource(Base, TimestampMixin):
    __tablename__ = "evidence_sources"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    base_url = Column(String(255))
    is_active = Column(Boolean, default=True)

    evidence = relationship("Evidence", back_populates="source")
