from typing import Optional
from datetime import datetime
from backend.app.schemas import CoreModel


class SubscriptionBase(CoreModel):
    organization_id: int
    plan_id: str
    status: str
    current_period_end: datetime


class SubscriptionCreate(SubscriptionBase):
    pass


class Subscription(SubscriptionBase):
    id: int

