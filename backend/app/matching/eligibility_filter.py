from typing import Any, Dict, List

class EligibilityFilter:
    def filter(self, *, candidates: List[Dict[str, Any]], job: Dict[str, Any]) -> List[Dict[str, Any]]:
        return candidates

    def is_eligible(self, *, candidate: Dict[str, Any], job: Dict[str, Any]) -> bool:
        return True


eligibility_filter = EligibilityFilter()
