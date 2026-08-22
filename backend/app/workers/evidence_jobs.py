import logging
from typing import Any, Dict

logger = logging.getLogger(__name__)


async def process_evidence_job(payload: Dict[str, Any]) -> None:
    evidence_id = payload.get("evidence_id")
    if not evidence_id:
        logger.warning("Missing evidence_id in evidence job payload")
        return
    try:
        from proofhire.backend.app.evidence.aggregator import aggregator
        from proofhire.backend.app.evidence.normalizer import normalizer
        raw = payload.get("raw_data", {})
        normalized = normalizer.normalize_github(raw_data=raw)
        aggregator.aggregate(evidence_list=[normalized.dict()])
    except Exception:
        logger.exception("Evidence job failed for %s", evidence_id)
