from sqlalchemy import Column, Integer, ForeignKey, String, Text, JSON
from sqlalchemy.orm import relationship
from proofhire.backend.app.database import Base
from proofhire.backend.app.models.base import TimestampMixin

class Contribution(Base, TimestampMixin):
    __tablename__ = "contributions"

    id = Column(Integer, primary_key=True, index=True)
    repository_id = Column(Integer, ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False)
    candidate_id = Column(Integer, ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False)
    type = Column(String(50))
    external_id = Column(String(255))
    details = Column(JSON)

    repository = relationship("Repository", back_populates="contributions")
    candidate = relationship("Candidate")
