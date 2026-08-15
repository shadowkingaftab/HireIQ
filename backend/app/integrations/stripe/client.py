import stripe
from typing import Dict, Any

class StripeClient:
    def __init__(self, api_key: str):
        stripe.api_key = api_key

    def create_session(self, *, success_url: str, cancel_url: str) -> str:
        # Simplified stripe session creation
        return "https://checkout.stripe.com/..."
