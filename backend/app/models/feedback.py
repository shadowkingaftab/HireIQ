from sqlalchemy import Column, Integer, Text, ForeignKey, Float
from sqlalchemy.orm import relationship
from proofhire.backend.app.database import Base
from proofhire.backend.app.models.base import TimestampMixin

class Feedback(Base, TimestampMixin):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id", ondelete="CASCADE"), nullable=False)
    interview_id = Column(Integer, ForeignKey("interviews.id", ondelete="SET NULL"))
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    rating = Column(Integer, nullable=False) # 1-5
    comment = Column(Text, nullable=False)
    recommendation = Column(String(50)) # hire, no_hire, strong_hire, etc.
    
    # Relationships
    application = relationship("Application", back_populates="feedbacks")
    interview = relationship("Interview", back_populates="feedback")
    author = relationship("User")

    def __repr__(self):
        return f"<Feedback(app_id={self.application_id}, rating={self.rating})>"
