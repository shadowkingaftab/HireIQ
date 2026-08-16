from typing import Any, Dict

class KaggleMapper:
    def map_competition_to_evidence(self, competition: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "source": "kaggle",
            "type": "competition",
            "content": competition,
            "raw_id": str(competition.get("id")),
        }
