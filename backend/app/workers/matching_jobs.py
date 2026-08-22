import logging
from typing import Any, Dict

logger = logging.getLogger(__name__)


async def run_matching_job(payload: Dict[str, Any]) -> None:
    job_id = payload.get("job_id")
    if not job_id:
        logger.warning("Missing job_id in matching job payload")
        return
    try:
        from proofhire.backend.app.matching.pipeline import MatchingPipeline
        pipeline = MatchingPipeline()
        await pipeline.run_for_job(job_id)
    except Exception:
        logger.exception("Matching job failed for job %s", job_id)
