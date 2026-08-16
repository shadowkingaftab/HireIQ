import logging
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


class RecruiterAnalytics:
    def __init__(self, db: Any):
        self.db = db

    async def activity_summary(self, recruiter_id: str, days: int = 30) -> Dict[str, Any]:
        since = datetime.utcnow() - timedelta(days=days)
        query = """
            SELECT count(*) FILTER (WHERE event = 'search') AS searches,
                   count(*) FILTER (WHERE event = 'view') AS views,
                   count(*) FILTER (WHERE event = 'shortlist') AS shortlists,
                   count(*) FILTER (WHERE event = 'message') AS messages
            FROM recruiter_events
            WHERE recruiter_id = :recruiter_id AND created_at >= :since
        """
        row = await self.db.fetch_one(query, {"recruiter_id": recruiter_id, "since": since})
        return dict(row) if row else {"searches": 0, "views": 0, "shortlists": 0, "messages": 0}

    async def time_to_shortlist(self, recruiter_id: str, days: int = 90) -> Dict[str, Any]:
        since = datetime.utcnow() - timedelta(days=days)
        query = """
            SELECT avg(extract(epoch FROM (shortlist_ts - view_ts))) AS avg_seconds
            FROM recruiter_funnels
            WHERE recruiter_id = :recruiter_id AND view_ts >= :since AND shortlist_ts IS NOT NULL
        """
        row = await self.db.fetch_one(query, {"recruiter_id": recruiter_id, "since": since})
        avg_seconds = row["avg_seconds"] if row and row.get("avg_seconds") is not None else 0.0
        return {"avg_seconds": avg_seconds, "avg_minutes": round(avg_seconds / 60.0, 2) if avg_seconds else 0.0}

    async def top_sources(self, recruiter_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        query = """
            SELECT source, count(*) AS count
            FROM recruiter_events
            WHERE recruiter_id = :recruiter_id AND source IS NOT NULL
            GROUP BY source
            ORDER BY count DESC
            LIMIT :limit
        """
        rows = await self.db.fetch_all(query, {"recruiter_id": recruiter_id, "limit": limit})
        return [dict(r) for r in rows]


recruiter_analytics = RecruiterAnalytics(db=None)
