from typing import List, Dict, Any

class ResultBuilder:
    def build_summary(self, *, session_data: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "score": 0.0,
            "competencies": {},
            "raw_results": session_data
        }

result_builder = ResultBuilder()
