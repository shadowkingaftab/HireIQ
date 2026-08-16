from typing import Any, Dict, List

class CodeForcesClient:
    def __init__(self):
        self.base_url = "https://codeforces.com/api"

    async def get_user_profile(self, username: str) -> Dict[str, Any]:
        return {}

    async def get_user_submissions(self, username: str) -> List[Dict[str, Any]]:
        return []
