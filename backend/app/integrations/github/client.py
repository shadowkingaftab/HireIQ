from typing import Any, Dict, List, Optional

class GitHubClient:
    def __init__(self, token: Optional[str] = None):
        self.token = token
        self.base_url = "https://api.github.com"

    async def get_user_repos(self, username: str) -> List[Dict[str, Any]]:
        return []

    async def get_repo(self, owner: str, repo: str) -> Dict[str, Any]:
        return {}


github_client = GitHubClient()
