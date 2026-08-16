from typing import List, Dict, Any
from proofhire.backend.app.matching.feature_builder import feature_builder
from proofhire.backend.app.matching.graph_matcher import graph_matcher
from proofhire.backend.app.matching.experience_matcher import experience_matcher
from proofhire.backend.app.matching.evidence_quality_matcher import evidence_quality_matcher
from proofhire.backend.app.matching.uncertainty import uncertainty
from proofhire.backend.app.matching.score_calibrator import score_calibrator

class ScoringEngine:
    def calculate_score(self, *, job: Dict[str, Any], candidate: Dict[str, Any]) -> Dict[str, Any]:
        features = feature_builder.build_for_pair(job=job, candidate=candidate)
        graph_score = graph_matcher.match(job=job, candidate=candidate)
        experience_score = experience_matcher.match(job=job, candidate=candidate)
        evidence_score = evidence_quality_matcher.match(job=job, candidate=candidate)
        total = (
            0.4 * graph_score.get("score", 0.0)
            + 0.3 * experience_score.get("score", 0.0)
            + 0.3 * evidence_score.get("score", 0.0)
        )
        calibrated = score_calibrator.calibrate(total)
        unc = uncertainty.estimate(score=calibrated, evidence_count=features.get("evidence_count", 0))
        return {
            "total_score": calibrated,
            "matched_skills": graph_score.get("matched_skills", []),
            "missing_skills": graph_score.get("missing_skills", []),
            "reasoning": {"features": features, "uncertainty": unc},
        }


scoring_engine = ScoringEngine()
