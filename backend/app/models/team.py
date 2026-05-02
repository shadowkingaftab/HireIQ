from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Table
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from .base import Base

# Association table for Team Members
team_members = Table(
    "team_members",
    Base.metadata,
    Column("team_id", UUID(as_uuid=True), ForeignKey("teams.id"), primary_key=True),
    Column("user_id", UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True),
    Column("role", String, default="member")  # admin, member
)

class Team(Base):
    __tablename__ = "teams"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    invite_code = Column(String, unique=True, default=lambda: uuid.uuid4().hex[:8])
    created_at = Column(DateTime, server_default="now()")
    updated_at = Column(DateTime, server_default="now()", onupdate="now()")

    # Relationships
    owner = relationship("User", foreign_keys=[owner_id])
    members = relationship("User", secondary=team_members, backref="teams")
