from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from proofhire.backend.app.database import Base
from proofhire.backend.app.models.base import TimestampMixin

class Repository(Base, TimestampMixin):
    __tablename__ = "repositories"

    id = Column(Integer, primary_key=True, index=True)
    external_id = Column(String(255), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    full_name = Column(String(255))
    url = Column(String(512))
    description = Column(Text)
    
    primary_language = Column(String(100))
    languages = Column(JSON) # Lang breakdown
    topics = Column(JSON)
    
    stargazers_count = Column(Integer, default=0)
    forks_count = Column(Integer, default=0)
    
    # Relationships
    contributions = relationship("Contribution", back_populates="repository")

class Contribution(Base, TimestampMixin):
    __tablename__ = "contributions"

    id = Column(Integer, primary_key=True, index=True)
    repository_id = Column(Integer, ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False)
    candidate_id = Column(Integer, ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False)
    
    type = Column(String(50)) # commit, pull_request, issue
    external_id = Column(String(255))
    details = Column(JSON)
    
    # Relationships
    repository = relationship("Repository", back_populates="contributions")
    candidate = relationship("Candidate")
