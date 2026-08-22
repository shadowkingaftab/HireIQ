import logging
from typing import Any, Dict

logger = logging.getLogger(__name__)


async def sync_github_profile_job(payload: Dict[str, Any]) -> None:
    username = payload.get("username")
    candidate_id = payload.get("candidate_id")
    if not username or not candidate_id:
        logger.warning("Missing username or candidate_id in github job payload")
        return
    try:
        from proofhire.backend.app.services.github_fetcher import github_fetcher
        await github_fetcher.fetch_user_repos(username=username)
    except Exception:
        logger.exception("GitHub sync job failed for %s", username)
