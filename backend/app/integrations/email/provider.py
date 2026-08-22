from typing import Any, Dict
from proofhire.backend.app.integrations.base.provider import BaseProvider

class EmailProvider(BaseProvider):
    name = "email"

    async def validate_credentials(self, credentials: Dict[str, Any]) -> bool:
        return bool(credentials.get("api_key"))

    async def send(self, *, to: str, subject: str, body: str) -> Dict[str, Any]:
        return {"status": "sent", "to": to}

    async def health(self) -> Dict[str, Any]:
        return {"provider": self.name, "status": "ok"}
