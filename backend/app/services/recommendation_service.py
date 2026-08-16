from typing import Any, Dict, List

class RecommendationService:
    def recommend_jobs(self, *, candidate_id: int, limit: int = 10) -> List[Dict[str, Any]]:
        return []

    def recommend_candidates(self, *, job_id: int, limit: int = 10) -> List[Dict[str, Any]]:
        return []


recommendation_service = RecommendationService()
