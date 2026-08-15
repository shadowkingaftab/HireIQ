import httpx
from typing import Dict, Any, List

class GithubClient:
    def __init__(self, access_token: str):
        self.access_token = access_token
        self.base_url = "https://api.github.com"
        self.headers = {
            "Authorization": f"token {access_token}",
            "Accept": "application/vnd.github.v3+json"
        }

    async def get_user(self) -> Dict[str, Any]:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{self.base_url}/user", headers=self.headers)
            response.raise_for_status()
            return response.json()

    async def get_repos(self) -> List[Dict[str, Any]]:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{self.base_url}/user/repos", headers=self.headers)
            response.raise_for_status()
            return response.json()
