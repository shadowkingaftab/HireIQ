from typing import Any, Dict

class LeetCodeMapper:
    def map_submission_to_evidence(self, submission: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "source": "leetcode",
            "type": "submission",
            "content": submission,
            "raw_id": str(submission.get("id")),
        }
