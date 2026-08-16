from typing import Any, Dict, List

class CapabilityEngine:
    def infer(self, *, skills: List[str]) -> List[Dict[str, Any]]:
        return [{"name": s, "confidence": 0.8} for s in skills]


capability_engine = CapabilityEngine()
