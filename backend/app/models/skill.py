from sqlalchemy import Column, String, Text, ForeignKey, Table
from sqlalchemy.orm import relationship
from proofhire.backend.app.database import Base
from proofhire.backend.app.models.base import TimestampMixin

# Self-referential table for skill relationships (Skill Graph edges)
skill_relationships = Table(
    "skill_relationships",
    Base.metadata,
    Column("from_skill_id", String(100), ForeignKey("skills.id", ondelete="CASCADE"), primary_key=True),
    Column("to_skill_id", String(100), ForeignKey("skills.id", ondelete="CASCADE"), primary_key=True),
    Column("relation_type", String(50), default="related"), # e.g., "required_by", "subset_of", "related"
)

class Skill(Base, TimestampMixin):
    __tablename__ = "skills"

    id = Column(String(100), primary_key=True, index=True) # e.g., "python", "fastapi"
    name = Column(String(100), unique=True, index=True, nullable=False)
    category = Column(String(100), index=True)
    description = Column(Text)
    
    # Relationships
    related_skills = relationship(
        "Skill",
        secondary=skill_relationships,
        primaryjoin=id == skill_relationships.c.from_skill_id,
        secondaryjoin=id == skill_relationships.c.to_skill_id,
        backref="related_to"
    )
    endorsements = relationship("Endorsement", back_populates="skill")

    def __repr__(self):
        return f"<Skill(name={self.name})>"
