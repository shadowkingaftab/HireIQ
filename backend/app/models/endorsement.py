from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from proofhire.backend.app.database import Base
from proofhire.backend.app.models.base import TimestampMixin

class Endorsement(Base, TimestampMixin):
    __tablename__ = "endorsements"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False)
    skill_id = Column(String(100), ForeignKey("skills.id", ondelete="CASCADE"), nullable=False)
    endorser_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    comment = Column(Text)
    
    # Relationships
    candidate = relationship("Candidate", back_populates="endorsements")
    skill = relationship("Skill", back_populates="endorsements")
    endorser = relationship("User")

    def __repr__(self):
        return f"<Endorsement(candidate_id={self.candidate_id}, skill_id={self.skill_id})>"
