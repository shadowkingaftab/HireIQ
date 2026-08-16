from typing import Any, Dict, List

class SkillConfidence:
    def compute(self, *, evidence_count: int, avg_reliability: float) -> float:
        if evidence_count == 0:
            return 0.0
        return min(1.0, avg_reliability * min(evidence_count / 5, 1.0))


skill_confidence = SkillConfidence()
