from sqlalchemy import Column, String, Float, JSON, DateTime
from sqlalchemy.dialects.postgresql import UUID
import uuid
from .base import Base

class SkillGraph(Base):
    __tablename__ = "skill_graphs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    candidate_id = Column(UUID(as_uuid=True), unique=True)  # One graph per candidate
    nodes = Column(JSON, nullable=False)  # {"Python": {"weight": 0.9, "category": "Language"}}
    edges = Column(JSON, nullable=False)  # [{"source": "Python", "target": "Django", "weight": 0.8}]
    updated_at = Column(DateTime, server_default="now()")
