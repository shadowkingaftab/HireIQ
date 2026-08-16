import logging
from typing import Any, Dict

logger = logging.getLogger(__name__)


async def run_analytics_job(payload: Dict[str, Any]) -> None:
    organization_id = payload.get("organization_id")
    if not organization_id:
        logger.warning("Missing organization_id in analytics job payload")
        return
    try:
        from proofhire.backend.app.analytics.analytics_queries import AnalyticsQueries
        queries = AnalyticsQueries()
        await queries.organization.overview(organization_id)
    except Exception:
        logger.exception("Analytics job failed for org %s", organization_id)
