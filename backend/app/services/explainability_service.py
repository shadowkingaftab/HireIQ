from typing import Dict, Any
from proofhire.backend.app.contracts.matching import MatchingResult

class ExplainabilityService:
    def build_explanation(self, *, match: MatchingResult) -> str:
        # Human-readable explanation of a match result
        if match.score > 80:
            return f"Excellent match! The candidate has {len(match.matched_skills)} of the key skills required."
        elif match.score > 50:
            return "Good potential. Meets many requirements but lacks some core competencies."
        else:
            return "Low match. Significant skill gaps identified."

explainability_service = ExplainabilityService()
