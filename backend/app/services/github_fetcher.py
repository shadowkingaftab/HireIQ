from typing import List, Dict, Any
import httpx

class GithubFetcher:
    async def fetch_user_repos(self, *, username: str) -> List[Dict[str, Any]]:
        # In production, use authenticated requests and handle pagination
        url = f"https://api.github.com/users/{username}/repos"
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            response.raise_for_status()
            return response.json()

github_fetcher = GithubFetcher()
