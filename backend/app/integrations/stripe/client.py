import logging
from typing import Any, Dict, Optional

logger = logging.getLogger(__name__)


class StripeClient:
    def __init__(self, api_key: str):
        self.api_key = api_key

    def create_session(self, *, success_url: str, cancel_url: str, amount: int = 0, currency: str = "usd") -> Dict[str, Any]:
        logger.debug("Creating stripe session for %s %s", amount, currency)
        return {"id": "cs_placeholder", "url": success_url}

    async def create_customer(self, *, email: str, name: str) -> Dict[str, Any]:
        return {"id": "cus_placeholder", "email": email, "name": name}


class StripeIntegration:
    def __init__(self, client: Optional[StripeClient] = None):
        self.client = client

    async def handle_webhook(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        event_type = payload.get("type")
        logger.info("Received stripe webhook %s", event_type)
        return {"received": True}
