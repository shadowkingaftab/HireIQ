from sqlalchemy import Column, String, Float
from sqlalchemy.dialects.postgresql import UUID
import uuid
from .base import Base

class Skill(Base):
    __tablename__ = "skills"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, unique=True, nullable=False)
    category = Column(String, nullable=True)  # e.g., "Language", "Framework"
