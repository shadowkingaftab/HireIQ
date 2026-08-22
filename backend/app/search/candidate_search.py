import logging
from typing import Any, Dict, List, Optional

from proofhire.backend.app.search.semantic_search import SemanticSearch
from proofhire.backend.app.search.filters import SearchFilters
from proofhire.backend.app.search.ranking import Ranker

logger = logging.getLogger(__name__)


class CandidateSearch:
    def __init__(
        self,
        search_index: Any,
        graph_db: Any,
        semantic_search: Optional[SemanticSearch] = None,
        ranker: Optional[Ranker] = None,
    ):
        self.search_index = search_index
        self.graph_db = graph_db
        self.semantic_search = semantic_search
        self.ranker = ranker or Ranker()

    async def search(self, params: Dict[str, Any]) -> List[Dict[str, Any]]:
        query = params.get("query", "")
        filters = params.get("filters", {})
        page = int(params.get("page", 1))
        page_size = int(params.get("page_size", 20))
        organization_id = params.get("organization_id")

        search_filters = SearchFilters(organization_id=organization_id, **filters)
        text_query = query or ""

        candidates = await self._keyword_search(text_query, search_filters, page_size)
        if self.semantic_search and query:
            semantic = await self.semantic_search.search_similar(
                query=text_query,
                entity_type="candidate",
                filters=search_filters.to_dict(),
                limit=page_size,
            )
            candidates = self._merge_results(candidates, semantic)

        ranked = self.ranker.rank_candidates(candidates, query)
        start = (page - 1) * page_size
        end = start + page_size
        return ranked[start:end]

    async def _keyword_search(
        self, query: str, search_filters: SearchFilters, limit: int
    ) -> List[Dict[str, Any]]:
        if not query:
            return []
        try:
            results = await self.search_index.search(
                collection="candidates",
                query=query,
                filters=search_filters.to_dict(),
                limit=limit * 2,
            )
            return [hit.payload for hit in results]
        except Exception:
            logger.exception("Keyword search failed")
            return []

    def _merge_results(
        self, primary: List[Dict[str, Any]], secondary: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        seen = {item.get("candidate_id") for item in primary if item.get("candidate_id")}
        merged = list(primary)
        for item in secondary:
            cid = item.get("candidate_id")
            if cid and cid not in seen:
                merged.append(item)
                seen.add(cid)
        return merged


candidate_search = CandidateSearch(search_index=None, graph_db=None)
