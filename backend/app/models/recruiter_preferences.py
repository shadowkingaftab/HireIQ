from sqlalchemy import Column, Integer, ForeignKey, JSON, Boolean
from sqlalchemy.orm import relationship
from proofhire.backend.app.database import Base
from proofhire.backend.app.models.base import TimestampMixin

class RecruiterPreferences(Base, TimestampMixin):
    __tablename__ = "recruiter_preferences"

    id = Column(Integer, primary_key=True, index=True)
    recruiter_id = Column(Integer, ForeignKey("recruiters.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    notification_settings = Column(JSON, default=dict)
    default_matching_threshold = Column(Integer, default=70)
    auto_archive_rejected = Column(Boolean, default=False)
    display_settings = Column(JSON, default=dict)
    
    # Relationships
    recruiter = relationship("Recruiter", back_populates="preferences")

    def __repr__(self):
        return f"<RecruiterPreferences(recruiter_id={self.recruiter_id})>"
