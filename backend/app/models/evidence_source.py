from backend.app.database import Base
from backend.app.models.base import TimestampMixin
from sqlalchemy import Boolean, Column, Integer, String
from sqlalchemy.orm import relationship


class EvidenceSource(Base, TimestampMixin):
    __tablename__ = "evidence_sources"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    base_url = Column(String(255))
    is_active = Column(Boolean, default=True)

    evidence = relationship("Evidence", back_populates="source")

