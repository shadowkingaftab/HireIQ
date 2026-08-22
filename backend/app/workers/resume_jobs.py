import logging
from typing import Any, Dict

logger = logging.getLogger(__name__)


async def process_resume_job(payload: Dict[str, Any]) -> None:
    resume_id = payload.get("resume_id")
    if not resume_id:
        logger.warning("Missing resume_id in resume job payload")
        return
    try:
        from proofhire.backend.app.services.resume_parser import resume_parser
        await resume_parser.parse(resume_id)
    except Exception:
        logger.exception("Resume job failed for %s", resume_id)
