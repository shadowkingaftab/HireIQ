from typing import List, Optional
from sqlalchemy.orm import Session
from proofhire.backend.app.contracts.subscriptions import SubscriptionCreate
from proofhire.backend.app.models.subscription import Subscription
from proofhire.backend.app.integrations.stripe.client import StripeClient

class PaymentService:
    def __init__(self, stripe_client: Optional[StripeClient] = None):
        self.stripe_client = stripe_client

    def list_subscriptions(self, db: Session, *, organization_id: int) -> List[Subscription]:
        return db.query(Subscription).filter(Subscription.organization_id == organization_id).all()

    def create_subscription(self, db: Session, *, sub_in: SubscriptionCreate) -> Subscription:
        db_obj = Subscription(**sub_in.dict())
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        if self.stripe_client:
            self.stripe_client.create_session(success_url="http://localhost:3000/success", cancel_url="http://localhost:3000/cancel")
        return db_obj


payment_service = PaymentService()
