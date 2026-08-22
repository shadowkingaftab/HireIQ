import logging
from typing import Any, Dict, Optional

from proofhire.backend.app.evidence.contracts import NormalizedEvidence

logger = logging.getLogger(__name__)


class Normalizer:
    def normalize_github(self, *, raw_data: Dict[str, Any]) -> NormalizedEvidence:
        return NormalizedEvidence(
            source="github",
            type="repository",
            content=raw_data,
            raw_id=str(raw_data.get("id")),
            timestamp=raw_data.get("updated_at"),
        )

    def normalize(self, *, source: str, raw_data: Dict[str, Any]) -> NormalizedEvidence:
        source = source.lower()
        if source == "github":
            return self.normalize_github(raw_data=raw_data)
        return NormalizedEvidence(source=source, type="unknown", content=raw_data, raw_id=str(raw_data.get("id")), timestamp=raw_data.get("updated_at"))


normalizer = Normalizer()
