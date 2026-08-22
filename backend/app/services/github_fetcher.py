from typing import Any, Dict, List, Optional

class GitHubFetcher:
    async def fetch_user_repos(self, *, username: str) -> Dict[str, Any]:
        return {"username": username, "repositories": []}


github_fetcher = GitHubFetcher()
