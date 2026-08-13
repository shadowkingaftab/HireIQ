from typing import Generic, List, TypeVar, Optional
from pydantic import BaseModel, Field
from proofhire.backend.app.core.constants import DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE

T = TypeVar("T")

class Page(BaseModel, Generic[T]):
    items: List[T]
    total: int
    page: int
    size: int
    pages: int

class Params(BaseModel):
    page: int = Field(1, ge=1)
    size: int = Field(DEFAULT_PAGE_SIZE, ge=1, le=MAX_PAGE_SIZE)
