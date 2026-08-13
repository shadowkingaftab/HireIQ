from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from proofhire.backend.app.database import Base
from proofhire.backend.app.models.base import TimestampMixin

class InterviewQuestion(Base, TimestampMixin):
    __tablename__ = "interview_questions"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    category = Column(String(100)) # technical, behavioral, etc.
    expected_answer = Column(Text)
    weight = Column(Integer, default=1)
    
    organization_id = Column(Integer, ForeignKey("organizations.id", ondelete="CASCADE"))
    
    # Relationships
    organization = relationship("Organization")

    def __repr__(self):
        return f"<InterviewQuestion(category={self.category})>"
