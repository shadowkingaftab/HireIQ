from sqlalchemy import Column, String, Integer, DateTime, JSON, Index
from sqlalchemy.dialects.postgresql import UUID
import uuid
from .base import Base

class AnalyticsEvent(Base):
    __tablename__ = "analytics_events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=True)  # Null for unauthenticated
    event_type = Column(String, nullable=False)  # e.g., "signup", "resume_upload", "match_analyzed"
    event_metadata = Column(JSON, nullable=True)  # Using event_metadata because metadata is a reserved attribute in SQLAlchemy
    timestamp = Column(DateTime, server_default="now()")

    __table_args__ = (
        Index('idx_analytics_event_type', 'event_type'),
        Index('idx_analytics_timestamp', 'timestamp'),
    )
