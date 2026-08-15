from typing import Dict, Any
from proofhire.backend.app.integrations.base.provider import BaseProvider

class StripeProvider(BaseProvider):
    @property
    def name(self) -> str:
        return "stripe"

    async def validate_credentials(self, credentials: Dict[str, Any]) -> bool:
        return bool(credentials.get("api_key"))

    async def fetch_data(self, query: Any) -> Any:
        pass
