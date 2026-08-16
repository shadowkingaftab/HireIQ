from typing import Any, Dict, List

class NpmClient:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://registry.npmjs.org"

    async def get_package(self, name: str) -> Dict[str, Any]:
        return {}

    async def get_downloads(self, name: str) -> List[Dict[str, Any]]:
        return []
