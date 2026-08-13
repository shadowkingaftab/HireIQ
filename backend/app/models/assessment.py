from sqlalchemy import Column, Integer, String, Text, ForeignKey, Float, JSON
from sqlalchemy.orm import relationship
from proofhire.backend.app.database import Base
from proofhire.backend.app.models.base import TimestampMixin

class Assessment(Base, TimestampMixin):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    duration_minutes = Column(Integer)
    total_score = Column(Float, default=100.0)
    
    config = Column(JSON, default=dict) # Questions, rules, etc.
    
    organization_id = Column(Integer, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    
    # Relationships
    organization = relationship("Organization", back_populates="assessments")
    coding_sessions = relationship("CodingSession", back_populates="assessment", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Assessment(title={self.title})>"
