from typing import Optional

from backend.app.schemas import CoreModel


class Params(CoreModel):
    page: int = 1
    size: int = 20


class SearchParams(CoreModel):
    query: str
    filters: Optional[dict] = None
    page: int = 1
    size: int = 20


class SortParams(CoreModel):
    field: str
    order: str = "asc"

