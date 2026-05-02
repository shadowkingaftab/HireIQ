from sqlalchemy import Column, String, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
import uuid
from .base import Base

class Endorsement(Base):
    __tablename__ = "endorsements"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    candidate_id = Column(UUID(as_uuid=True))  # Who is being endorsed
    endorser_id = Column(UUID(as_uuid=True))  # Who is endorsing
    skill_id = Column(UUID(as_uuid=True))  # Which skill is endorsed
    created_at = Column(DateTime, server_default="now()")
