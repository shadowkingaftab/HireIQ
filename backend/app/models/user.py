from sqlalchemy import Column, String, Boolean, DateTime, Index, Integer, JSON
from sqlalchemy.dialects.postgresql import UUID
import uuid
from .base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    name = Column(String, nullable=True)
    github_username = Column(String, nullable=True)
    is_recruiter = Column(Boolean, default=False)
    referrals_count = Column(Integer, default=0)
    referral_rewards = Column(JSON, default=[])  # List of strings e.g., ["Pro Badge", "Free Month"]
    created_at = Column(DateTime, server_default="now()")

    __table_args__ = (
        Index('idx_user_email', 'email', unique=True),
    )
