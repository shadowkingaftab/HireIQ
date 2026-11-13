from backend.app.database import Base
from backend.app.models.base import TimestampMixin
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text


class DataConsent(Base, TimestampMixin):
    __tablename__ = "data_consents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    purpose = Column(String(100), nullable=False)
    granted = Column(Boolean, default=False)
    consent_text = Column(Text)

