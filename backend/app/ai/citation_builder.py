import logging
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


class CitationBuilder:
    def __init__(self):
        self._source_index: Dict[str, Dict[str, Any]] = {}

    def register_source(self, source_id: str, source: Dict[str, Any]) -> None:
        self._source_index[source_id] = source

    def build_citation(self, source_id: str, excerpt: str, start_offset: int = 0, end_offset: Optional[int] = None) -> Dict[str, Any]:
        source = self._source_index.get(source_id, {})
        end = end_offset if end_offset is not None else len(excerpt)
        return {
            "source_id": source_id,
            "source_type": source.get("type"),
            "url": source.get("url"),
            "title": source.get("title"),
            "excerpt": excerpt,
            "start_offset": start_offset,
            "end_offset": end,
            "provenance": source.get("provenance", {}),
        }

    def build_citations_for_claim(self, claim: str, source_ids: List[str]) -> List[Dict[str, Any]]:
        citations = []
        for source_id in source_ids:
            source = self._source_index.get(source_id, {})
            text = source.get("text", "")
            excerpt = self._find_excerpt(text, claim)
            citations.append(self.build_citation(source_id=source_id, excerpt=excerpt))
        return citations

    def _find_excerpt(self, text: str, claim: str, window: int = 120) -> str:
        if not text or not claim:
            return text[:window] if text else ""
        lower_text = text.lower()
        lower_claim = claim.lower()
        pos = lower_text.find(lower_claim)
        if pos == -1:
            return text[:window]
        start = max(0, pos - window // 2)
        end = min(len(text), pos + len(claim) + window // 2)
        return text[start:end]

    def clear(self) -> None:
        self._source_index.clear()


citation_builder = CitationBuilder()
