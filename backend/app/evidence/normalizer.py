from typing import Dict, Any
from proofhire.backend.app.evidence.contracts import NormalizedEvidence

class Normalizer:
    def normalize_github(self, *, raw_data: Dict[str, Any]) -> NormalizedEvidence:
        return NormalizedEvidence(
            source="github",
            type="repository",
            content=raw_data,
            raw_id=str(raw_data.get("id")),
            timestamp=raw_data.get("updated_at")
        )

normalizer = Normalizer()
