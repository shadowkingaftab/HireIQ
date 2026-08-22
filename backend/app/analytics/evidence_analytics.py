import logging
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


class EvidenceAnalytics:
    def __init__(self, db: Any):
        self.db = db

    async def evidence_quality_trend(self, organization_id: str, days: int = 30) -> List[Dict[str, Any]]:
        since = datetime.utcnow() - timedelta(days=days)
        query = """
            SELECT date_trunc('day', created_at) AS day, avg(quality_score) AS avg_score, count(*) AS evidence_count
            FROM evidence_records
            WHERE organization_id = :organization_id AND created_at >= :since
            GROUP BY day
            ORDER BY day
        """
        rows = await self.db.fetch_all(query, {"organization_id": organization_id, "since": since})
        return [dict(r) for r in rows]

    async def source_distribution(self, organization_id: str) -> List[Dict[str, Any]]:
        query = """
            SELECT source_type, count(*) AS count, avg(confidence) AS avg_confidence
            FROM evidence_records
            WHERE organization_id = :organization_id
            GROUP BY source_type
            ORDER BY count DESC
        """
        rows = await self.db.fetch_all(query, {"organization_id": organization_id})
        return [dict(r) for r in rows]


evidence_analytics = EvidenceAnalytics(db=None)
