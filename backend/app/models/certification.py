from backend.app.database import Base
from backend.app.models.base import TimestampMixin
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String


class Certification(Base, TimestampMixin):
    __tablename__ = "certifications"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    issuer = Column(String(255))
    issued_at = Column(DateTime(timezone=True))
    expires_at = Column(DateTime(timezone=True))
    credential_url = Column(String(512))

