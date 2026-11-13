from backend.app.database import Base
from backend.app.models.base import TimestampMixin
from sqlalchemy import JSON, Column, DateTime, Integer, String, func


class SkillGraph(Base, TimestampMixin):
    __tablename__ = "skill_graph_metadata"

    id = Column(Integer, primary_key=True, index=True)
    version = Column(String(50), nullable=False)
    graph_data = Column(JSON) # Snapshot of the graph if needed
    last_rebuilt_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    status = Column(String(50), default="active")

    def __repr__(self):
        return f"<SkillGraph(version={self.version})>"

