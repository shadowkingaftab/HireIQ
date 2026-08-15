from typing import List, Dict, Any

class Aggregator:
    def aggregate(self, *, evidence_list: List[Dict[str, Any]]) -> Dict[str, Any]:
        # Combine multiple pieces of evidence into a single candidate profile
        return {
            "top_skills": [],
            "evidence_count": len(evidence_list)
        }

aggregator = Aggregator()
