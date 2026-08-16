import logging
from typing import Any, Dict

logger = logging.getLogger(__name__)


async def generate_report_job(payload: Dict[str, Any]) -> None:
    report_id = payload.get("report_id")
    if not report_id:
        logger.warning("Missing report_id in report job payload")
        return
    try:
        from proofhire.backend.app.services.report_service import report_service
        await report_service.generate(report_id=report_id)
    except Exception:
        logger.exception("Report job failed for %s", report_id)
