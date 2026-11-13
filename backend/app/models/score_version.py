from backend.app.database import Base
from backend.app.models.base import TimestampMixin
from sqlalchemy import JSON, Boolean, Column, Integer, String, Text


class ScoreVersion(Base, TimestampMixin):
    __tablename__ = "score_versions"

    id = Column(Integer, primary_key=True, index=True)
    version_tag = Column(String(50), unique=True, nullable=False)
    algorithm_description = Column(Text)
    parameters = Column(JSON)

    is_active = Column(Boolean, default=False, nullable=False)

    def __repr__(self):
        return f"<ScoreVersion(version_tag={self.version_tag})>"
