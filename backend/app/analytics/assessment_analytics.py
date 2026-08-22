import logging
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


class AssessmentAnalytics:
    def __init__(self, db: Any):
        self.db = db

    async def completion_rates(self, organization_id: str, days: int = 30) -> Dict[str, Any]:
        since = datetime.utcnow() - timedelta(days=days)
        query = """
            SELECT assessment_id, count(*) AS attempts,
                   count(*) FILTER (WHERE completed = true) AS completions,
                   avg(score) AS avg_score
            FROM assessment_attempts
            WHERE organization_id = :organization_id AND created_at >= :since
            GROUP BY assessment_id
            ORDER BY attempts DESC
            LIMIT 20
        """
        rows = await self.db.fetch_all(query, {"organization_id": organization_id, "since": since})
        results = []
        for row in rows:
            data = dict(row)
            data["completion_rate"] = round(data["completions"] / data["attempts"], 4) if data["attempts"] else 0.0
            results.append(data)
        return {"organization_id": organization_id, "assessments": results}

    async def score_distribution(self, assessment_id: str) -> Dict[str, Any]:
        query = """
            SELECT score, count(*) AS count
            FROM assessment_attempts
            WHERE assessment_id = :assessment_id AND completed = true
            GROUP BY score
            ORDER BY score
        """
        rows = await self.db.fetch_all(query, {"assessment_id": assessment_id})
        return {"assessment_id": assessment_id, "distribution": [dict(r) for r in rows]}


assessment_analytics = AssessmentAnalytics(db=None)
