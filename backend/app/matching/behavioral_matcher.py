from typing import Any, Dict, List

class BehavioralMatcher:
    def match(self, *, job: Dict[str, Any], candidate: Dict[str, Any]) -> Dict[str, Any]:
        return {"score": 0.0, "signals": []}


behavioral_matcher = BehavioralMatcher()
