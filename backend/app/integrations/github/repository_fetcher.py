import logging
from typing import Any, Dict, List

logger = logging.getLogger(__name__)


class RepositoryFetcher:
    def __init__(self, client: Any = None):
        self.client = client

    async def fetch_user_repositories(self, username: str) -> List[Dict[str, Any]]:
        if self.client is None:
            return []
        return await self.client.get_user_repos(username)


repository_fetcher = RepositoryFetcher()
