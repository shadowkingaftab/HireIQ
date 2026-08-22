from typing import Optional, List, Dict, Any
from proofhire.backend.app.schemas import CoreModel


class SearchParams(CoreModel):
    query: str
    filters: Optional[dict] = None
    page: int = 1
    size: int = 20


class SortParams(CoreModel):
    field: str
    order: str = "asc"
