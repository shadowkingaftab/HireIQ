import logging
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


class ModelAnalytics:
    def __init__(self, db: Any):
        self.db = db

    async def usage_by_model(self, organization_id: str, days: int = 30) -> List[Dict[str, Any]]:
        since = datetime.utcnow() - timedelta(days=days)
        query = """
            SELECT model, count(*) AS calls, avg(latency_ms) AS avg_latency, avg(tokens_used) AS avg_tokens
            FROM ai_inference_logs
            WHERE organization_id = :organization_id AND created_at >= :since
            GROUP BY model
            ORDER BY calls DESC
        """
        rows = await self.db.fetch_all(query, {"organization_id": organization_id, "since": since})
        return [dict(r) for r in rows]

    async def cost_estimate(self, organization_id: str, days: int = 30) -> Dict[str, Any]:
        usage = await self.usage_by_model(organization_id, days=days)
        total_calls = sum(row["calls"] for row in usage)
        total_tokens = sum((row.get("avg_tokens") or 0) * row["calls"] for row in usage)
        return {"organization_id": organization_id, "total_calls": total_calls, "total_tokens": total_tokens, "by_model": usage}


model_analytics = ModelAnalytics(db=None)
