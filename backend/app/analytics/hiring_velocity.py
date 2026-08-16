import logging
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


class HiringVelocity:
    def __init__(self, db: Any):
        self.db = db

    async def avg_time_to_hire(self, organization_id: str, days: int = 90) -> Dict[str, Any]:
        since = datetime.utcnow() - timedelta(days=days)
        query = """
            SELECT avg(extract(epoch FROM (hired_at - applied_at))) AS avg_seconds,
                   count(*) AS hires
            FROM applications
            WHERE organization_id = :organization_id AND status = 'hired' AND applied_at >= :since
        """
        row = await self.db.fetch_one(query, {"organization_id": organization_id, "since": since})
        if not row or row.get("avg_seconds") is None:
            return {"organization_id": organization_id, "avg_days": 0.0, "hires": 0}
        avg_seconds = float(row["avg_seconds"])
        return {"organization_id": organization_id, "avg_days": round(avg_seconds / 86400.0, 2), "hires": row["hires"]}

    async def pipeline_throughput(self, organization_id: str, days: int = 30) -> Dict[str, Any]:
        since = datetime.utcnow() - timedelta(days=days)
        query = """
            SELECT date_trunc('day', created_at) AS day, count(*) AS applications
            FROM applications
            WHERE organization_id = :organization_id AND created_at >= :since
            GROUP BY day
            ORDER BY day
        """
        rows = await self.db.fetch_all(query, {"organization_id": organization_id, "since": since})
        return {"organization_id": organization_id, "throughput": [dict(r) for r in rows]}


hiring_velocity = HiringVelocity(db=None)
