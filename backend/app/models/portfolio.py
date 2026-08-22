from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from proofhire.backend.app.database import Base
from proofhire.backend.app.models.base import TimestampMixin

class Portfolio(Base, TimestampMixin):
    __tablename__ = "portfolios"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255))
    description = Column(Text)
    url = Column(String(512))
    metadata = Column(JSON, default=dict)

    candidate = relationship("Candidate", back_populates="portfolios")
