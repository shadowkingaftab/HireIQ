from typing import Dict, Any
from proofhire.backend.app.models.job import Job
from proofhire.backend.app.models.candidate import Candidate

class ExperienceMatcher:
    def match(self, *, job: Job, candidate: Candidate) -> Dict[str, Any]:
        # Years of experience and seniority match
        return {"score": 0.9, "years": 5}

experience_matcher = ExperienceMatcher()
