from sqlalchemy import Column, String, Text, JSON, DateTime, Index
from sqlalchemy.dialects.postgresql import UUID
import uuid
from .base import Base

class Job(Base):
    __tablename__ = "jobs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    required_skills = Column(JSON, nullable=True)  # e.g., ["Python", "Django"]
    nice_to_have_skills = Column(JSON, nullable=True)  # e.g., ["AWS"]
    greenhouse_id = Column(String, nullable=True)
    created_at = Column(DateTime, server_default="now()")

    __table_args__ = (
        Index('idx_job_title', 'title'),
    )
