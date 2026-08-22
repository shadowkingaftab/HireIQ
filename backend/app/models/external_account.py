from sqlalchemy import Column, Integer, String, ForeignKey, JSON, Boolean
from sqlalchemy.orm import relationship
from proofhire.backend.app.database import Base
from proofhire.backend.app.models.base import TimestampMixin

class ExternalAccount(Base, TimestampMixin):
    __tablename__ = "external_accounts"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False)
    provider = Column(String(50), nullable=False) # github, linkedin, stackoverflow
    external_id = Column(String(255), nullable=False)
    username = Column(String(255))
    
    access_token = Column(String(512))
    refresh_token = Column(String(512))
    scopes = Column(JSON)
    
    is_verified = Column(Boolean, default=False)
    
    # Relationships
    candidate = relationship("Candidate", back_populates="external_accounts")

    def __repr__(self):
        return f"<ExternalAccount(provider={self.provider}, username={self.username})>"
