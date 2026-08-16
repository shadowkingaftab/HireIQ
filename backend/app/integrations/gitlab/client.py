from typing import Any, Dict, List

class GitLabClient:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://gitlab.com/api/v4"

    async def get_projects(self) -> List[Dict[str, Any]]:
        return []

    async def get_merge_requests(self, project_id: str) -> List[Dict[str, Any]]:
        return []
