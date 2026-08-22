from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from backend.app.database import Base
from backend.app.models.base import TimestampMixin


class Subscription(Base, TimestampMixin):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(
        Integer,
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
    )
    plan_id = Column(String(100), nullable=False)
    status = Column(String(50), nullable=False, default="active")
    current_period_end = Column(DateTime(timezone=True), nullable=False)

    organization = relationship("Organization")

    def __repr__(self):
        return (
            f"<Subscription("
            f"organization_id={self.organization_id}, "
            f"plan_id={self.plan_id}, "
            f"status={self.status})>"
        )
