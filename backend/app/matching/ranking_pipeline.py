from typing import List, Dict, Any
from proofhire.backend.app.matching.pipeline import matching_pipeline

class RankingPipeline:
    def rank_results(self, results: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        return sorted(results, key=lambda x: x["score"], reverse=True)

ranking_pipeline = RankingPipeline()
