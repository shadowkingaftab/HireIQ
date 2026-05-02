from sqlalchemy import Column, String, DateTime, Integer, Index
from sqlalchemy.dialects.postgresql import UUID
import uuid
from .base import Base

class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=True)
    email = Column(String, unique=True, nullable=False)
    github_username = Column(String, unique=True, nullable=True)
    created_at = Column(DateTime, server_default="now()")

    __table_args__ = (
        Index('idx_candidate_email', 'email', unique=True),
        Index('idx_candidate_github', 'github_username'),
    )
