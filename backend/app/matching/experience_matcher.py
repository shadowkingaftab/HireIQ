from typing import Any, Dict


class ExperienceMatcher:
    def match(self, *, job: Dict[str, Any], candidate: Dict[str, Any]) -> Dict[str, Any]:
        # Years of experience and seniority match
        return {"score": 0.9, "years": 5}

experience_matcher = ExperienceMatcher()

