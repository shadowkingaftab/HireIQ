from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from proofhire.backend.app.database import Base
from proofhire.backend.app.models.base import TimestampMixin

class Project(Base, TimestampMixin):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False)
    
    title = Column(String(255), nullable=False)
    description = Column(Text)
    url = Column(String(512))
    role = Column(String(100))
    
    technologies = Column(JSON) # List of skill/tech IDs
    
    # Relationships
    candidate = relationship("Candidate")

class Portfolio(Base, TimestampMixin):
    __tablename__ = "portfolios"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    bio = Column(Text)
    custom_links = Column(JSON)
    theme_config = Column(JSON)
    
    # Relationships
    candidate = relationship("Candidate")

class Certification(Base, TimestampMixin):
    __tablename__ = "certifications"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False)
    
    name = Column(String(255), nullable=False)
    issuer = Column(String(255))
    issue_date = Column(DateTime(timezone=True))
    expiry_date = Column(DateTime(timezone=True))
    external_id = Column(String(255))
    url = Column(String(512))
    
    # Relationships
    candidate = relationship("Candidate")

class Achievement(Base, TimestampMixin):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False)
    
    title = Column(String(255), nullable=False)
    description = Column(Text)
    date = Column(DateTime(timezone=True))
    
    # Relationships
    candidate = relationship("Candidate")
