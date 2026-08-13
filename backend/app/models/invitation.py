from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from proofhire.backend.app.database import Base
from proofhire.backend.app.models.base import TimestampMixin
import uuid

class Invitation(Base, TimestampMixin):
    __tablename__ = "invitations"

    id = Column(Integer, primary_key=True, index=True)
    token = Column(String(255), unique=True, index=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), nullable=False)
    organization_id = Column(Integer, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    inviter_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    role = Column(String(50), default="member")
    status = Column(String(20), default="pending") # pending, accepted, expired, revoked
    expires_at = Column(DateTime(timezone=True), nullable=False)
    
    # Relationships
    organization = relationship("Organization", back_populates="invitations")
    inviter = relationship("User")

    def __repr__(self):
        return f"<Invitation(email={self.email}, org_id={self.organization_id})>"
