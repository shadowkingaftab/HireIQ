from typing import List, Dict, Any
from sqlalchemy.orm import Session
from proofhire.backend.app.models.job import Job
from proofhire.backend.app.models.candidate import Candidate
from proofhire.backend.app.matching.semantic_matcher import semantic_matcher
from proofhire.backend.app.matching.capability_matcher import capability_matcher

class MatchingPipeline:
    def execute(self, db: Session, *, job: Job, candidate: Candidate) -> Dict[str, Any]:
        # Orchestrate multiple matchers
        semantic_res = semantic_matcher.match(job=job, candidate=candidate)
        capability_res = capability_matcher.match(job=job, candidate=candidate)
        
        # Weighted average or more complex ensemble
        total_score = (semantic_res["score"] * 0.4) + (capability_res["score"] * 0.6)
        
        return {
            "score": total_score,
            "semantic": semantic_res,
            "capability": capability_res
        }

matching_pipeline = MatchingPipeline()
