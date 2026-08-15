from typing import Dict, Any

class GreenhouseClient:
    def __init__(self, api_key: str):
        self.api_key = api_key

    async def get_candidate(self, candidate_id: str) -> Dict[str, Any]:
        return {}
