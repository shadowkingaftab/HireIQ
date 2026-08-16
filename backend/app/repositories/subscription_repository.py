from sqlalchemy.orm import Session
from proofhire.backend.app.repositories.base_repository import BaseRepository
from proofhire.backend.app.models.subscription import Subscription

class SubscriptionRepository(BaseRepository[Subscription]):
    pass

subscription_repository = SubscriptionRepository(Subscription)
