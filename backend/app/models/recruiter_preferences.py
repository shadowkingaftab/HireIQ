from sqlalchemy import Column, String, Float, JSON, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from .base import Base

class RecruiterPreference(Base):
    __tablename__ = "recruiter_preferences"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    recruiter_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)
    skill_weights = Column(JSON, default={})  # {"Python": 1.2, "Django": 0.8}
    role_weights = Column(JSON, default={})  # {"Senior": 1.5, "Junior": 0.5}
    experience_weights = Column(JSON, default={})  # {"5+ years": 1.3, "1-3 years": 0.9}
    
    recruiter = relationship("User")
