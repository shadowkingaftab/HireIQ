from typing import Any, Dict, List

class BiasAudit:
    def audit(self, *, matches: List[Dict[str, Any]]) -> Dict[str, Any]:
        return {"passed": True, "metrics": {}}


bias_audit = BiasAudit()
