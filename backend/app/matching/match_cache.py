import logging
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


class MatchCache:
    def __init__(self):
        self._cache: Dict[str, Dict[str, Any]] = {}

    def key(self, job_id: int, candidate_id: int) -> str:
        return f"match:{job_id}:{candidate_id}"

    def get(self, job_id: int, candidate_id: int) -> Optional[Dict[str, Any]]:
        return self._cache.get(self.key(job_id, candidate_id))

    def set(self, job_id: int, candidate_id: int, result: Dict[str, Any]) -> None:
        self._cache[self.key(job_id, candidate_id)] = result

    def invalidate(self, job_id: Optional[int] = None, candidate_id: Optional[int] = None) -> None:
        if job_id is None and candidate_id is None:
            self._cache.clear()
            return
        keys = [k for k in self._cache if str(job_id) in k and str(candidate_id) in k]
        for key in keys:
            del self._cache[key]


match_cache = MatchCache()
