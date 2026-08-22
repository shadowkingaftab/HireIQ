from typing import Any, Dict
from proofhire.backend.app.integrations.base.provider import BaseProvider

class GitHubProvider(BaseProvider):
    name = "github"

    async def validate_credentials(self, credentials: Dict[str, Any]) -> bool:
        return bool(credentials.get("token"))

    async def fetch_data(self, query: Any) -> Any:
        return None

    async def health(self) -> Dict[str, Any]:
        return {"provider": self.name, "status": "ok"}


github_provider = GitHubProvider()
