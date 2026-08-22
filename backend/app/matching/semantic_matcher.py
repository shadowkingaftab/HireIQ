from typing import Dict, Any
from proofhire.backend.app.models.job import Job
from proofhire.backend.app.models.candidate import Candidate

class SemanticMatcher:
    def match(self, *, job: Job, candidate: Candidate) -> Dict[str, Any]:
        # NLP based matching of text descriptions
        return {"score": 0.85, "matches": []}

semantic_matcher = SemanticMatcher()
