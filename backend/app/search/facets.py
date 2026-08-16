import logging
from typing import Any, Dict, List

logger = logging.getLogger(__name__)


class FacetResult:
    def __init__(self, key: str, buckets: List[Dict[str, Any]]):
        self.key = key
        self.buckets = buckets

    def to_dict(self) -> Dict[str, Any]:
        return {"key": self.key, "buckets": self.buckets}


class Facets:
    @staticmethod
    def build(results: List[Dict[str, Any]], facet_keys: List[str]) -> List[FacetResult]:
        facet_results = []
        for key in facet_keys:
            buckets: Dict[str, int] = {}
            for item in results:
                value = item.get(key)
                if value is None:
                    continue
                if isinstance(value, list):
                    for part in value:
                        buckets[str(part).lower()] = buckets.get(str(part).lower(), 0) + 1
                else:
                    buckets[str(value).lower()] = buckets.get(str(value).lower(), 0) + 1
            sorted_buckets = sorted(buckets.items(), key=lambda x: x[1], reverse=True)
            facet_results.append(
                FacetResult(
                    key=key,
                    buckets=[{"value": k, "count": v} for k, v in sorted_buckets],
                )
            )
        return facet_results

    @staticmethod
    def to_dicts(facet_results: List[FacetResult]) -> List[Dict[str, Any]]:
        return [f.to_dict() for f in facet_results]


def apply_facets(results: List[Dict[str, Any]], facet_keys: List[str]) -> List[Dict[str, Any]]:
    return Facets.to_dicts(Facets.build(results, facet_keys))
