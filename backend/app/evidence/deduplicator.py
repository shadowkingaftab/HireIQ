from typing import List, Dict, Any

class Deduplicator:
    def find_duplicates(self, *, evidence_list: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        # Remove redundant evidence (e.g. same repo fetched twice)
        seen_ids = set()
        unique = []
        for e in evidence_list:
            e_id = e.get("raw_id")
            if e_id not in seen_ids:
                unique.append(e)
                seen_ids.add(e_id)
        return unique

deduplicator = Deduplicator()
