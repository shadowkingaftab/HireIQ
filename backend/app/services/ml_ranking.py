from typing import Any, Dict, List

class MLRanking:
    def rank(self, *, candidates: List[Dict[str, Any]], job: Dict[str, Any]) -> List[Dict[str, Any]]:
        return sorted(candidates, key=lambda c: c.get("score", 0), reverse=True)


ml_ranking = MLRanking()
