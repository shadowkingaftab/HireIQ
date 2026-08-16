from typing import Any, Dict, List

class HackerRankClient:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://www.hackerrank.com/api/v1"

    async def get_tests(self) -> List[Dict[str, Any]]:
        return []

    async def get_results(self, test_id: str) -> Dict[str, Any]:
        return {}
