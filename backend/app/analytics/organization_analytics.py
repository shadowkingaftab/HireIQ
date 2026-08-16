import logging
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


class OrganizationAnalytics:
    def __init__(self, db: Any):
        self.db = db

    async def overview(self, organization_id: str) -> Dict[str, Any]:
        query = """
            SELECT count(DISTINCT candidate_id) AS candidates,
                   count(DISTINCT job_id) AS jobs,
                   count(DISTINCT application_id) AS applications,
                   count(DISTINCT CASE WHEN status = 'offered' THEN application_id END) AS offers
            FROM org_metrics
            WHERE organization_id = :organization_id
        """
        row = await self.db.fetch_one(query, {"organization_id": organization_id})
        return dict(row) if row else {}

    async def diversity_breakdown(self, organization_id: str) -> Dict[str, Any]:
        query = """
            SELECT dimension, value, count(*) AS count
            FROM org_diversity_metrics
            WHERE organization_id = :organization_id
            GROUP BY dimension, value
            ORDER BY dimension, count DESC
        """
        rows = await self.db.fetch_all(query, {"organization_id": organization_id})
        return {"organization_id": organization_id, "breakdown": [dict(r) for r in rows]}

    async def hiring_funnel(self, organization_id: str, start: Optional[datetime] = None, end: Optional[Optional[datetime]] = None) -> Dict[str, Any]:
        start = start or datetime.utcnow() - timedelta(days=30)
        end = end or datetime.utcnow()
        query = """
            SELECT status, count(*) AS count
            FROM applications
            WHERE organization_id = :organization_id AND created_at >= :start AND created_at <= :end
            GROUP BY status
            ORDER BY count DESC
        """
        rows = await self.db.fetch_all(query, {"organization_id": organization_id, "start": start, "end": end})
        return {"organization_id": organization_id, "funnel": [dict(r) for r in rows]}


organization_analytics = OrganizationAnalytics(db=None)
