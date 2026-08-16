from typing import Any, Dict

class CodeForcesMapper:
    def map_submission_to_evidence(self, submission: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "source": "codeforces",
            "type": "submission",
            "content": submission,
            "raw_id": str(submission.get("id")),
        }
