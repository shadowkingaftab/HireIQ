import logging
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


class CandidateAnalytics:
    def __init__(self, db: Any, search_index: Any):
        self.db = db
        self.search_index = search_index

    async def profile_completeness(self, candidate_id: str) -> Dict[str, Any]:
        profile = await self.db.candidates.find_by_id(candidate_id)
        if not profile:
            return {"candidate_id": candidate_id, "completeness": 0.0, "fields": {}}
        fields = {
            "name": bool(profile.get("name")),
            "email": bool(profile.get("email")),
            "skills": bool(profile.get("skills")),
            "experience": bool(profile.get("experience")),
            "education": bool(profile.get("education")),
            "assessments": bool(profile.get("assessments")),
            "evidence": bool(profile.get("evidence")),
        }
        completeness = sum(1 for v in fields.values() if v) / len(fields)
        return {"candidate_id": candidate_id, "completeness": round(completeness, 4), "fields": fields}

    async def skill_coverage(self, organization_id: str) -> Dict[str, Any]:
        query = """
            SELECT unnest(skills) AS skill, count(*) AS candidate_count
            FROM candidates
            WHERE organization_id = :organization_id
            GROUP BY skill
            ORDER BY candidate_count DESC
            LIMIT 50
        """
        rows = await self.db.fetch_all(query, {"organization_id": organization_id})
        return {"organization_id": organization_id, "skills": [dict(r) for r in rows]}

    async def search_performance(self, organization_id: str, days: int = 30) -> Dict[str, Any]:
        since = datetime.utcnow() - timedelta(days=days)
        query = """
            SELECT count(*) AS total_searches,
                   avg(latency_ms) AS avg_latency,
                   count(DISTINCT candidate_id) AS unique_candidates_viewed
            FROM search_events
            WHERE organization_id = :organization_id AND created_at >= :since
        """
        row = await self.db.fetch_one(query, {"organization_id": organization_id, "since": since})
        return dict(row) if row else {"total_searches": 0, "avg_latency": 0.0, "unique_candidates_viewed": 0}


candidate_analytics = CandidateAnalytics(db=None, search_index=None)
