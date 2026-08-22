from typing import Any, Dict

from proofhire.backend.app.matching.graph_matcher import graph_matcher
from proofhire.backend.app.matching.semantic_matcher import semantic_matcher

class CapabilityMatcher:
    def match(self, *, job: Dict[str, Any], candidate: Dict[str, Any]) -> Dict[str, Any]:
        semantic = semantic_matcher.match(job=job, candidate=candidate)
        graph = graph_matcher.match(job=job, candidate=candidate)
        score = (semantic.get("score", 0.0) + graph.get("score", 0.0)) / 2
        return {"score": score, "matched_skills": graph.get("matched_skills", []), "missing_skills": graph.get("missing_skills", [])}


capability_matcher = CapabilityMatcher()
