from backend.app.database import Base
from backend.app.models.base import TimestampMixin
from sqlalchemy import Column, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship


class MatchResult(Base, TimestampMixin):
    __tablename__ = "match_results"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    candidate_id = Column(Integer, ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False)

    score = Column(Float, nullable=False, index=True)
    status = Column(String(50), default="calculated")

    job = relationship("Job", back_populates="match_results")
    candidate = relationship("Candidate")
    explanation = relationship(
        "MatchExplanation",
        back_populates="match_result",
        uselist=False,
        cascade="all, delete-orphan",
    )

    def __repr__(self):
        return (
            f"<MatchResult("
            f"job_id={self.job_id}, "
            f"candidate_id={self.candidate_id}, "
            f"score={self.score})>"
        )
