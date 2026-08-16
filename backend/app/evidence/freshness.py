import logging
from datetime import datetime, timezone
from typing import Any, Dict, Optional

logger = logging.getLogger(__name__)


class Freshness:
    def evaluate(self, *, timestamp: Optional[str], max_age_days: int = 90) -> Dict[str, Any]:
        if not timestamp:
            return {"fresh": False, "age_days": None, "reason": "missing_timestamp"}
        try:
            dt = datetime.fromisoformat(timestamp.replace("Z", "+00:00"))
            now = datetime.now(timezone.utc)
            age_days = max((now - dt).total_seconds() / 86400.0, 0)
            return {"fresh": age_days <= max_age_days, "age_days": age_days, "reason": "stale" if age_days > max_age_days else "fresh"}
        except Exception:
            logger.exception("Freshness evaluation failed")
            return {"fresh": False, "age_days": None, "reason": "parse_error"}


freshness = Freshness()
