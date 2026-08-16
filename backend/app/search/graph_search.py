import logging
from typing import Any, Dict, List, Optional

from proofhire.backend.app.core.config import settings

logger = logging.getLogger(__name__)


class GraphSearch:
    def __init__(self, graph_db: Any, semantic_search: Optional[Any] = None):
        self.graph_db = graph_db
        self.semantic_search = semantic_search
        self.max_hops = 3

    async def find_related_candidates(
        self, candidate_id: str, relation_types: Optional[List[str]] = None, max_hops: int = 2
    ) -> List[Dict[str, Any]]:
        if self.graph_db is None:
            logger.warning("Graph DB not configured")
            return []

        try:
            return await self.graph_db.traverse(
                start_node_id=candidate_id,
                label="Candidate",
                relation_types=relation_types or ["HAS_SKILL", "CONTRIBUTED_TO"],
                max_hops=max(self.max_hops, max_hops),
            )
        except Exception:
            logger.exception("Graph traversal failed for candidate %s", candidate_id)
            return []

    async def find_similar_by_graph(
        self,
        candidate_id: str,
        filters: Optional[Dict[str, Any]] = None,
        limit: int = 20,
    ) -> List[Dict[str, Any]]:
        related = await self.find_related_candidates(candidate_id, max_hops=2)
        scored = []
        for node in related:
            if filters:
                if not self._matches_filters(node, filters):
                    continue
            scored.append({"id": node.get("id"), "score": float(node.get("score", 0.0)), "data": node})
        scored.sort(key=lambda x: x["score"], reverse=True)
        return scored[:limit]

    async def shortest_path(
        self, source_id: str, target_id: str, max_hops: Optional[int] = None
    ) -> Optional[Dict[str, Any]]:
        if self.graph_db is None:
            return None
        try:
            return await self.graph_db.shortest_path(
                source_id=source_id,
                target_id=target_id,
                max_hops=max_hops or self.max_hops,
            )
        except Exception:
            logger.exception("Shortest path failed")
            return None

    def _matches_filters(self, node: Dict[str, Any], filters: Dict[str, Any]) -> bool:
        if not filters:
            return True
        if filters.get("organization_id") and node.get("organization_id") != filters["organization_id"]:
            return False
        if filters.get("skills"):
            node_skills = {s.lower() for s in node.get("skills", [])}
            if not node_skills.intersection({s.lower() for s in filters["skills"]}):
                return False
        return True


graph_search = GraphSearch(graph_db=None)
