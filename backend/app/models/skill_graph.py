from sqlalchemy import Column, String, Float, JSON, ForeignKey, Integer
from sqlalchemy.orm import relationship
from proofhire.backend.app.database import Base
from proofhire.backend.app.models.base import TimestampMixin

class SkillGraph(Base, TimestampMixin):
    __tablename__ = "skill_graph_metadata"

    id = Column(Integer, primary_key=True, index=True)
    version = Column(String(50), nullable=False)
    graph_data = Column(JSON) # Snapshot of the graph if needed
    last_rebuilt_at = Column(TimestampMixin.updated_at)
    
    status = Column(String(50), default="active")

    def __repr__(self):
        return f"<SkillGraph(version={self.version})>"
