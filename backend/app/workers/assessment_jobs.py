import logging
from typing import Any, Dict

logger = logging.getLogger(__name__)


async def run_assessment_job(payload: Dict[str, Any]) -> None:
    assessment_id = payload.get("assessment_id")
    candidate_id = payload.get("candidate_id")
    if not assessment_id or not candidate_id:
        logger.warning("Missing assessment_id or candidate_id in assessment job payload")
        return
    try:
        from proofhire.backend.app.assessment.test_executor import test_executor
        await test_executor.run(assessment_id=assessment_id, candidate_id=candidate_id)
    except Exception:
        logger.exception("Assessment job failed for %s", assessment_id)
