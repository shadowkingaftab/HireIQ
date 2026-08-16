import logging
from typing import Any, Dict, List, Optional

from proofhire.backend.app.search.semantic_search import SemanticSearch
from proofhire.backend.app.search.filters import SearchFilters
from proofhire.backend.app.search.ranking import Ranker

logger = logging.getLogger(__name__)


class JobSearch:
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

        jobs = await self._keyword_search(text_query, search_filters, page_size)
        if self.semantic_search and query:
            semantic = await self.semantic_search.search_similar(
                query=text_query,
                entity_type="job",
                filters=search_filters.to_dict(),
                limit=page_size,
            )
            jobs = self._merge_results(jobs, semantic)

        ranked = self.ranker.rank_jobs(jobs, query)
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
                collection="jobs",
                query=query,
                filters=search_filters.to_dict(),
                limit=limit * 2,
            )
            return [hit.payload for hit in results]
        except Exception:
            logger.exception("Keyword job search failed")
            return []

    def _merge_results(
        self, primary: List[Dict[str, Any]], secondary: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        seen = {item.get("job_id") for item in primary if item.get("job_id")}
        merged = list(primary)
        for item in secondary:
            jid = item.get("job_id")
            if jid and jid not in seen:
                merged.append(item)
                seen.add(jid)
        return merged


job_search = JobSearch(search_index=None, graph_db=None)
