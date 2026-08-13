from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from proofhire.backend.app.database import Base
from proofhire.backend.app.models.base import TimestampMixin

class Interview(Base, TimestampMixin):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id", ondelete="CASCADE"), nullable=False)
    
    scheduled_at = Column(DateTime(timezone=True), nullable=False)
    end_at = Column(DateTime(timezone=True))
    
    location = Column(String(512)) # Zoom link or physical address
    status = Column(String(50), default="scheduled") # scheduled, completed, cancelled, rescheduled
    meeting_id = Column(String(255)) # External meeting ID
    
    # Relationships
    application = relationship("Application", back_populates="interviews")
    feedback = relationship("Feedback", back_populates="interview", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Interview(app_id={self.application_id}, scheduled_at={self.scheduled_at})>"
