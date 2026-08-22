from typing import Any, Dict, List

class BitbucketClient:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.bitbucket.org/2.0"

    async def get_repositories(self, workspace: str) -> List[Dict[str, Any]]:
        return []

    async def get_pull_requests(self, workspace: str, repo: str) -> List[Dict[str, Any]]:
        return []
