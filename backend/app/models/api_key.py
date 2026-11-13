from backend.app.database import Base
from backend.app.models.base import TimestampMixin
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String


class APIKey(Base, TimestampMixin):
    __tablename__ = "api_keys"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(100), nullable=False)
    key_hash = Column(String(255), unique=True, nullable=False)
    last_used_at = Column(DateTime(timezone=True))

