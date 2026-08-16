from typing import Any, Dict, List, Optional

class AdaptiveTesting:
    def select_next(self, *, history: List[Dict[str, Any]]) -> Dict[str, Any]:
        return {"difficulty": "medium"}


adaptive_testing = AdaptiveTesting()
