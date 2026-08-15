from typing import Any, List
from fastapi import APIRouter, Depends
from proofhire.backend.app.contracts.search import GlobalSearchRequest, SearchResult

router = APIRouter()

@router.post("", response_model=List[SearchResult])
def search(
    *,
    search_in: GlobalSearchRequest,
) -> Any:
    # Logic to call search index would go here
    return []
