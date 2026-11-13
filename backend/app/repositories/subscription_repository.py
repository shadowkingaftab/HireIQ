from backend.app.models.subscription import Subscription
from backend.app.repositories.base_repository import BaseRepository


class SubscriptionRepository(BaseRepository[Subscription]):
    pass

subscription_repository = SubscriptionRepository(Subscription)

