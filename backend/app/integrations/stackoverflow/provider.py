from typing import Any, Dict
from proofhire.backend.app.integrations.base.provider import BaseProvider

class StackOverflowProvider(BaseProvider):
    name = "stackoverflow"

    async def validate_credentials(self, credentials: Dict[str, Any]) -> bool:
        return bool(credentials.get("api_key"))

    async def fetch_data(self, query: Any) -> Any:
        return None

    async def health(self) -> Dict[str, Any]:
        return {"provider": self.name, "status": "ok"}
