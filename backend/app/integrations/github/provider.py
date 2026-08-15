from typing import Dict, Any
from proofhire.backend.app.integrations.base.provider import BaseProvider
from proofhire.backend.app.integrations.github.client import GithubClient

class GithubProvider(BaseProvider):
    @property
    def name(self) -> str:
        return "github"

    async def validate_credentials(self, credentials: Dict[str, Any]) -> bool:
        token = credentials.get("access_token")
        if not token:
            return False
        client = GithubClient(token)
        try:
            await client.get_user()
            return True
        except Exception:
            return False

    async def fetch_data(self, query: Any) -> Any:
        # Implementation for generic fetch
        pass
