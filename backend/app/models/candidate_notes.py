from sqlalchemy import Column, Integer, Text, ForeignKey
from sqlalchemy.orm import relationship
from proofhire.backend.app.database import Base
from proofhire.backend.app.models.base import TimestampMixin

class CandidateNote(Base, TimestampMixin):
    __tablename__ = "candidate_notes"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    candidate_id = Column(Integer, ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False)
    application_id = Column(Integer, ForeignKey("applications.id", ondelete="SET NULL"))
    
    # Relationships
    author = relationship("User")
    candidate = relationship("Candidate", back_populates="notes")
    application = relationship("Application", back_populates="notes")

    def __repr__(self):
        return f"<CandidateNote(author_id={self.author_id}, candidate_id={self.candidate_id})>"
