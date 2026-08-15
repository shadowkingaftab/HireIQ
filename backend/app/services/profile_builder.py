from typing import List, Dict, Any
from proofhire.backend.app.models.candidate import Candidate

class ProfileBuilder:
    def build_comprehensive_profile(self, *, candidate: Candidate) -> Dict[str, Any]:
        # Merge evidence, scores, and manual data into a rich profile view
        return {
            "id": candidate.id,
            "full_name": candidate.user.full_name,
            "capabilities": [],
            "evidence_highlights": []
        }

profile_builder = ProfileBuilder()
