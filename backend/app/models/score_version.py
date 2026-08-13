from sqlalchemy import Column, Integer, String, Text, JSON
from sqlalchemy.orm import relationship
from proofhire.backend.app.database import Base
from proofhire.backend.app.models.base import TimestampMixin

class ScoreVersion(Base, TimestampMixin):
    __tablename__ = "score_versions"

    id = Column(Integer, primary_key=True, index=True)
    version_tag = Column(String(50), unique=True, nullable=False) # e.g., "v1.2.0"
    algorithm_description = Column(Text)
    parameters = Column(JSON) # Parameters used for this version
    
    is_active = Column(TimestampMixin.created_at)

    def __repr__(self):
        return f"<ScoreVersion(version_tag={self.version_tag})>"
