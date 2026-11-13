from backend.app.database import Base
from backend.app.models.base import TimestampMixin
from sqlalchemy import JSON, Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship


class Report(Base, TimestampMixin):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(
        Integer,
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    title = Column(String(255), nullable=False)
    type = Column(String(100), nullable=False)
    parameters = Column(JSON, nullable=True)

    file_url = Column(String(1024), nullable=True)
    generated_at = Column(DateTime(timezone=True), nullable=True)

    organization = relationship("Organization")
