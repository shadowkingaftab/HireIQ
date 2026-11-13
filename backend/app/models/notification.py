from backend.app.database import Base
from backend.app.models.base import TimestampMixin
from sqlalchemy import JSON, Boolean, Column, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship


class Notification(Base, TimestampMixin):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50))
    is_read = Column(Boolean, default=False)
    action_url = Column(String(512))
    payload = Column(JSON)

    user = relationship("User", back_populates="notifications")

    def __repr__(self):
        return f"<Notification(user_id={self.user_id}, title={self.title})>"
