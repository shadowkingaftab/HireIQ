from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
import uuid
from .base import Base

class Recruiter(Base):
    __tablename__ = "recruiters"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)
    company_name = Column(String, nullable=True)
    is_verified = Column(Boolean, default=False)
    dashboard_settings = Column(JSON, nullable=True)
    created_at = Column(DateTime, server_default="now()")
    updated_at = Column(DateTime, server_default="now()", onupdate="now()")
