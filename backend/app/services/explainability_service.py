from typing import Any, Dict


class ExplainabilityService:
    def explain_match(self, *, job: Dict[str, Any], candidate: Dict[str, Any], score: float) -> Dict[str, Any]:
        return {"score": score, "summary": "Match explanation", "details": {}}


explainability_service = ExplainabilityService()
