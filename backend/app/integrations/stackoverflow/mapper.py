from typing import Any, Dict

class StackOverflowMapper:
    def map_answer_to_evidence(self, answer: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "source": "stackoverflow",
            "type": "answer",
            "content": answer,
            "raw_id": str(answer.get("answer_id")),
        }
