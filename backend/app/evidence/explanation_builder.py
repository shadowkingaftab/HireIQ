from typing import List, Dict, Any

class ExplanationBuilder:
    def build(self, *, insights: List[Dict[str, Any]]) -> str:
        # Build human-readable explanations for evidence insights
        return "Explanation based on evidence."

explanation_builder = ExplanationBuilder()
