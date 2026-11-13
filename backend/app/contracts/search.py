from typing import Any, Dict, List

from backend.app.schemas import CoreModel


class SearchResult(CoreModel):
    id: str
    type: str
    score: float
    data: Dict[str, Any]


class GlobalSearchRequest(CoreModel):
    query: str
    types: List[str] = ["job", "candidate"]
    limit: int = 10

