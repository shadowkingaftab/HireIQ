from typing import Generic, TypeVar, List, Optional

T = TypeVar("T")

class PaginationParams:
    def __init__(self, page: int = 1, size: int = 20):
        self.page = page
        self.size = size

class PaginatedResponse(Generic[T]):
    def __init__(self, items: List[T], total: int, page: int, size: int):
        self.items = items
        self.total = total
        self.page = page
        self.size = size
        self.pages = (total + size - 1) // size if size else 0
