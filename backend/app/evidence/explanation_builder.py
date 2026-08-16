import logging
from typing import Any, Dict, List

logger = logging.getLogger(__name__)


class ExplanationBuilder:
    def build(self, *, insights: List[Dict[str, Any]]) -> str:
        if not insights:
            return "No evidence available."
        parts = []
        for insight in insights:
            source = insight.get("source", "unknown")
            confidence = insight.get("confidence", 0.0)
            parts.append(f"{source} evidence with confidence {confidence:.2f}")
        return "; ".join(parts)


explanation_builder = ExplanationBuilder()
