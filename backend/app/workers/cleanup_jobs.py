import logging
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


async def run_cleanup_job() -> None:
    try:
        from proofhire.backend.app.governance.retention_policy import retention_policy
        from proofhire.backend.app.evidence.contracts import NormalizedEvidence

        now = datetime.now(timezone.utc).isoformat()
        rules = retention_policy.list_rules()
        expired = [rule for rule in rules if retention_policy.evaluate(rule.entity_type, now)]
        logger.info("Cleanup job evaluated %s rules, %s expired", len(rules), len(expired))
    except Exception:
        logger.exception("Cleanup job failed")
