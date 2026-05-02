from sqlalchemy import Column, String, Float, Boolean, Text, DateTime, Integer
from sqlalchemy.dialects.postgresql import UUID
import uuid
from .base import Base

class HiringFeedback(Base):
    __tablename__ = "hiring_feedback"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    candidate_id = Column(UUID(as_uuid=True))  # Who was hired/rejected
    job_id = Column(UUID(as_uuid=True))  # Which job
    recruiter_id = Column(UUID(as_uuid=True))  # Who provided feedback
    hired = Column(Boolean, nullable=False)  # Was the candidate hired?
    performance_score = Column(Float, nullable=True)  # 1-5 scale (post-hire)
    notes = Column(Text, nullable=True)  # Additional comments
    created_at = Column(DateTime, server_default="now()")

class SurveyFeedback(Base):
    __tablename__ = "survey_feedback"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=True)
    rating = Column(Integer, nullable=False)  # 1-5
    feedback = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default="now()")
