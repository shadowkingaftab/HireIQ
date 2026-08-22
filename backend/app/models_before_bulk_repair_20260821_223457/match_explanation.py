from sqlalchemy import Column, Integer, ForeignKey, Float, JSON, Text
from sqlalchemy.orm import relationship
from backend.app.database import Base
from backend.app.models.base import TimestampMixin


class MatchExplanation(Base, TimestampMixin):
    __tablename__ = "match_explanations"

    id = Column(Integer, primary_key=True, index=True)
    match_result_id = Column(
        Integer,
        ForeignKey("match_results.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )

    summary = Column(Text)
    matched_skills = Column(JSON)
    missing_skills = Column(JSON)
    experience_fit = Column(Float)
    cultural_fit_score = Column(Float)
    ai_reasoning = Column(Text)

    match_result = relationship(
        "MatchResult",
        back_populates="explanation",
    )
