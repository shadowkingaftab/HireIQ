import logging
import math
from typing import Any, Dict, List, Optional

from proofhire.backend.app.core.config import settings

logger = logging.getLogger(__name__)


class SemanticSearch:
    def __init__(self, vector_store: Any, embedding_service: Optional[Any] = None):
        self.vector_store = vector_store
        self.embedding_service = embedding_service
        self.default_limit = 50
        self.score_threshold = 0.25

    async def search_similar(
        self,
        query: str,
        entity_type: str,
        filters: Optional[Dict[str, Any]] = None,
        limit: Optional[int] = None,
    ) -> List[Dict[str, Any]]:
        if not self.embedding_service:
            logger.warning("Embedding service not configured; returning empty results")
            return []

        vector = await self.embedding_service.embed_text(query)
        if vector is None:
            return []

        limit = limit or self.default_limit
        collection = "candidates" if entity_type == "candidate" else "jobs"

        try:
            hits = await self.vector_store.search(
                collection=collection,
                vector=vector,
                filters=filters or {},
                limit=limit,
                score_threshold=self.score_threshold,
            )
        except Exception:
            logger.exception("Semantic search failed for %s", entity_type)
            return []

        results = []
        for hit in hits:
            payload = hit.payload or {}
            payload.setdefault("score", hit.score)
            payload.setdefault("entity_type", entity_type)
            results.append(payload)
        return results

    async def similarity(self, left: Dict[str, Any], right: Dict[str, Any]) -> float:
        left_vector = left.get("embedding")
        right_vector = right.get("embedding")
        if not left_vector or not right_vector:
            return 0.0
        return self._cosine_similarity(left_vector, right_vector)

    def _cosine_similarity(self, a: List[float], b: List[float]) -> float:
        if len(a) != len(b):
            return 0.0
        dot = sum(x * y for x, y in zip(a, b))
        norm_a = math.sqrt(sum(x * x for x in a))
        norm_b = math.sqrt(sum(y * y for y in b))
        if norm_a == 0 or norm_b == 0:
            return 0.0
        return dot / (norm_a * norm_b)


semantic_search = SemanticSearch(vector_store=None)
