from typing import List, Dict, Any
from proofhire.backend.app.integrations.github.client import GithubClient
from proofhire.backend.app.integrations.github.mapper import github_mapper

class RepositoryFetcher:
    def __init__(self, client: GithubClient):
        self.client = client

    async def fetch_all(self) -> List[Dict[str, Any]]:
        raw_repos = await self.client.get_repos()
        return [github_mapper.map_repo(r) for r in raw_repos]
