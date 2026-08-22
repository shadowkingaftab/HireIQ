from typing import Any, Dict
from proofhire.backend.app.integrations.base.provider import BaseProvider

class LeetCodeProvider(BaseProvider):
    name = "leetcode"

    async def validate_credentials(self, credentials: Dict[str, Any]) -> bool:
        return True

    async def fetch_data(self, query: Any) -> Any:
        return None

    async def health(self) -> Dict[str, Any]:
        return {"provider": self.name, "status": "ok"}
