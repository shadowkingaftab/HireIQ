import logging
from typing import Any, Dict, List

logger = logging.getLogger(__name__)


class Deduplicator:
    def find_duplicates(self, *, evidence_list: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        seen_ids = set()
        unique = []
        for e in evidence_list:
            e_id = e.get("raw_id") or e.get("external_id") or f"{e.get('source')}:{e.get('type')}"
            if e_id not in seen_ids:
                unique.append(e)
                seen_ids.add(e_id)
        logger.debug("Deduplicated %s items to %s", len(evidence_list), len(unique))
        return unique


deduplicator = Deduplicator()
