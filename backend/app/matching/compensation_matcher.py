from typing import Any, Dict

class CompensationMatcher:
    def match(self, *, job: Dict[str, Any], candidate: Dict[str, Any]) -> Dict[str, Any]:
        return {"score": 0.0, "fit": "unknown"}


compensation_matcher = CompensationMatcher()
