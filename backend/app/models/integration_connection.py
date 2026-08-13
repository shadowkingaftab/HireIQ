from sqlalchemy import Column, Integer, String, ForeignKey, JSON, Boolean
from sqlalchemy.orm import relationship
from proofhire.backend.app.database import Base
from proofhire.backend.app.models.base import TimestampMixin

class IntegrationConnection(Base, TimestampMixin):
    __tablename__ = "integration_connections"

    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    provider = Column(String(50), nullable=False) # slack, jira, greenhouse
    
    config = Column(JSON, nullable=False)
    is_active = Column(Boolean, default=True)
    
    # Relationships
    organization = relationship("Organization", back_populates="integration_connections")

    def __repr__(self):
        return f"<IntegrationConnection(provider={self.provider}, org_id={self.organization_id})>"
