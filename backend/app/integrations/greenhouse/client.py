from typing import Any, Dict, Optional

class GreenhouseClient:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key
        self.base_url = "https://harvest.greenhouse.io/v1"

    async def get_jobs(self) -> List[Dict[str, Any]]:
        return []

    async def get_candidates(self, job_id: str) -> List[Dict[str, Any]]:
        return []


greenhouse_client = GreenhouseClient()
