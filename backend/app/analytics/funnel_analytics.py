import logging
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


class FunnelAnalytics:
    def __init__(self, db: Any):
        self.db = db

    async def funnel_metrics(self, job_id: str) -> Dict[str, Any]:
        query = """
            SELECT status, count(*) AS count
            FROM applications
            WHERE job_id = :job_id
            GROUP BY status
        """
        rows = await self.db.fetch_all(query, {"job_id": job_id})
        stages = [dict(r) for r in rows]
        total = sum(s["count"] for s in stages)
        return {"job_id": job_id, "stages": stages, "total": total}

    async def conversion_rates(self, job_id: str) -> Dict[str, Any]:
        funnel = await self.funnel_metrics(job_id)
        stage_map = {s["status"]: s["count"] for s in funnel.get("stages", [])}
        applied = stage_map.get("applied", 0)
        interviewing = stage_map.get("interviewing", 0)
        offered = stage_map.get("offered", 0)
        hired = stage_map.get("hired", 0)
        return {
            "job_id": job_id,
            "applied_to_interview": round((interviewing / applied), 4) if applied else 0.0,
            "interview_to_offer": round((offered / interviewing), 4) if interviewing else 0.0,
            "offer_to_hire": round((hired / offered), 4) if offered else 0.0,
        }

    async def drop_off_reasons(self, job_id: str) -> List[Dict[str, Any]]:
        query = """
            SELECT reason, count(*) AS count
            FROM application_events
            WHERE job_id = :job_id AND event = 'drop_off' AND reason IS NOT NULL
            GROUP BY reason
            ORDER BY count DESC
            LIMIT 20
        """
        rows = await self.db.fetch_all(query, {"job_id": job_id})
        return [dict(r) for r in rows]


funnel_analytics = FunnelAnalytics(db=None)
