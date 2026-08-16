import logging
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


class SourcingAnalytics:
    def __init__(self, db: Any):
        self.db = db

    async def source_effectiveness(self, organization_id: str, days: int = 30) -> List[Dict[str, Any]]:
        since = datetime.utcnow() - timedelta(days=days)
        query = """
            SELECT source, count(*) AS applications, count(*) FILTER (WHERE status = 'offered') AS offers
            FROM applications
            WHERE organization_id = :organization_id AND source IS NOT NULL AND applied_at >= :since
            GROUP BY source
            ORDER BY offers DESC
            LIMIT 20
        """
        rows = await self.db.fetch_all(query, {"organization_id": organization_id, "since": since})
        results = []
        for row in rows:
            data = dict(row)
            data["offer_rate"] = round(data["offers"] / data["applications"], 4) if data["applications"] else 0.0
            results.append(data)
        return results

    async def channel_breakdown(self, organization_id: str) -> Dict[str, Any]:
        query = """
            SELECT channel, count(*) AS candidate_count
            FROM candidates
            WHERE organization_id = :organization_id AND channel IS NOT NULL
            GROUP BY channel
            ORDER BY candidate_count DESC
        """
        rows = await self.db.fetch_all(query, {"organization_id": organization_id})
        return {"organization_id": organization_id, "channels": [dict(r) for r in rows]}


sourcing_analytics = SourcingAnalytics(db=None)
