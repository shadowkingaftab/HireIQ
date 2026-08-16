from typing import Any, Dict, List

class StackOverflowClient:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.stackexchange.com/2.3"

    async def search_users(self, query: str) -> List[Dict[str, Any]]:
        return []

    async def get_user_answers(self, user_id: int) -> List[Dict[str, Any]]:
        return []
