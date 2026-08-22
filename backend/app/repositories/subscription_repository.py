from sqlalchemy.orm import Session
from backend.app.repositories.base_repository import BaseRepository
from backend.app.models.subscription import Subscription

class SubscriptionRepository(BaseRepository[Subscription]):
    pass

subscription_repository = SubscriptionRepository(Subscription)

