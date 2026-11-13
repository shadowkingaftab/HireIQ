from backend.app.database import Base
from backend.app.models.base import TimestampMixin
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship


class RefreshToken(Base, TimestampMixin):
    __tablename__ = "refresh_tokens"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    token = Column(String(512), unique=True, nullable=False)

    expires_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    revoked = Column(
        Boolean,
        default=False,
        nullable=False,
    )

    user = relationship(
        "User",
        back_populates="refresh_tokens",
    )
