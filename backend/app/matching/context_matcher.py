from typing import Any, Dict

class ContextMatcher:
    def match(self, *, job: Dict[str, Any], candidate: Dict[str, Any]) -> Dict[str, Any]:
        return {"score": 0.0, "context": {}}


context_matcher = ContextMatcher()
