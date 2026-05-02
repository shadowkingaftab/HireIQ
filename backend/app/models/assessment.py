from sqlalchemy import Column, String, Text, Float, JSON, Integer, Boolean, DateTime
from sqlalchemy.dialects.postgresql import UUID
import uuid
from .base import Base

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    skill_id = Column(UUID(as_uuid=True))  # Foreign key to skills (UUID from skill model)
    problem = Column(Text, nullable=False)
    difficulty = Column(String, nullable=False)  # easy/medium/hard
    solution = Column(Text, nullable=False)  # Reference solution
    test_cases = Column(JSON, nullable=False)  # Input/output pairs
    time_limit = Column(Integer, default=30)  # Minutes

class CandidateAssessment(Base):
    __tablename__ = "candidate_assessments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    candidate_id = Column(UUID(as_uuid=True))  # Foreign key
    assessment_id = Column(UUID(as_uuid=True))  # Foreign key
    code = Column(Text, nullable=False)  # Candidate's submission
    passed = Column(Boolean, nullable=False)
    score = Column(Float, nullable=False)  # 0-100
    time_taken = Column(Integer, nullable=False)  # Seconds
    completed_at = Column(DateTime, server_default="now()")
