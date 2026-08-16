import logging
from typing import Any, Dict, List, Optional

from proofhire.backend.app.governance.fairness_governance import fairness_governance

logger = logging.getLogger(__name__)


class Fairness:
    def audit(self, *, matches: List[Dict[str, Any]], demographic_field: Optional[str] = None) -> Dict[str, Any]:
        if not matches:
            return {"passed": True, "disparity": 0.0}
        scores = [m.get("score", 0.0) for m in matches]
        min_score = min(scores)
        max_score = max(scores)
        disparity = max_score - min_score
        fairness_governance.register_metric(fairness_governance.FairnessMetric(metric_id="score_disparity", name="Score disparity", description="Max-min score difference", threshold=0.3, direction="max"))
        report = fairness_governance.evaluate("score_disparity", 1.0 - disparity, details={"min_score": min_score, "max_score": max_score})
        return {"passed": report.passed, "disparity": disparity, "report": report}


fairness = Fairness()
