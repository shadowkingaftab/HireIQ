from typing import Dict, Any
from proofhire.backend.app.models.job import Job
from proofhire.backend.app.models.candidate import Candidate

class CapabilityMatcher:
    def match(self, *, job: Job, candidate: Candidate) -> Dict[str, Any]:
        # High-level capability fit
        return {"score": 0.78, "matched_capabilities": []}

capability_matcher = CapabilityMatcher()
