from typing import Dict, Any
from proofhire.backend.app.services.github_fetcher import github_fetcher

async def sync_github_profile_job(payload: Dict[str, Any]):
    username = payload.get("username")
    # github_fetcher.fetch_user_repos(username=username)
    pass
