import logging
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


class Similarity:
    def jaccard(self, a: List[str], b: List[str]) -> float:
        set_a = set(a)
        set_b = set(b)
        if not set_a and not set_b:
            return 0.0
        return len(set_a.intersection(set_b)) / len(set_a.union(set_b))

    def cosine(self, a: List[float], b: List[float]) -> float:
        if len(a) != len(b) or not a:
            return 0.0
        dot = sum(x * y for x, y in zip(a, b))
        norm_a = sum(x * x for x in a) ** 0.5
        norm_b = sum(y * y for y in b) ** 0.5
        if norm_a == 0 or norm_b == 0:
            return 0.0
        return dot / (norm_a * norm_b)


similarity = Similarity()
