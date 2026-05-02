from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID
import uuid
from .base import Base

class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)
    stripe_customer_id = Column(String, unique=True, nullable=True)
    stripe_subscription_id = Column(String, unique=True, nullable=True)
    plan_type = Column(String, default="free")  # free, pro, team
    status = Column(String, default="active")  # active, canceled, past_due
    current_period_end = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default="now()")
    updated_at = Column(DateTime, server_default="now()", onupdate="now()")

    __table_args__ = (
        Index('idx_subscription_user', 'user_id', unique=True),
        Index('idx_subscription_status', 'status'),
    )
