from typing import Any, Dict, List

class ProfileBuilder:
    def build(self, *, candidate_id: int, evidence: List[Dict[str, Any]]) -> Dict[str, Any]:
        return {"candidate_id": candidate_id, "summary": "", "skills": [], "experience": []}


profile_builder = ProfileBuilder()
