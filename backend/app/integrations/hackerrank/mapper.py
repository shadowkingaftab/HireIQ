from typing import Any, Dict

class HackerRankMapper:
    def map_result_to_evidence(self, result: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "source": "hackerrank",
            "type": "assessment_result",
            "content": result,
            "raw_id": str(result.get("id")),
        }
