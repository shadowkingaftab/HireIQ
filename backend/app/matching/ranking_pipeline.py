from typing import Any, Dict, List


class RankingPipeline:
    def rank_results(self, results: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        return sorted(results, key=lambda x: x["score"], reverse=True)

ranking_pipeline = RankingPipeline()

