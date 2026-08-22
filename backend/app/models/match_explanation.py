from sqlalchemy import Column, Integer, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from proofhire.backend.app.database import Base
from proofhire.backend.app.models.base import TimestampMixin

class MatchExplanation(Base, TimestampMixin):
    __tablename__ = "match_explanations"

    id = Column(Integer, primary_key=True, index=True)
    match_id = Column(Integer, ForeignKey("match_results.id", ondelete="CASCADE"), nullable=False)
    summary = Column(Text)
    details = Column(JSON, default=dict)
