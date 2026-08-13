from typing import Optional, List
from proofhire.backend.app.schemas import CoreModel

class SubscriptionBase(CoreModel):
    organization_id: int
    plan_id: str
    status: str
    current_period_end: datetime

class Subscription(SubscriptionBase):
    id: int
