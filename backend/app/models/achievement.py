from backend.app.database import Base
from backend.app.models.base import TimestampMixin
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text


class Achievement(Base, TimestampMixin):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    earned_at = Column(DateTime(timezone=True))

