from fastapi import APIRouter, Depends
from proofhire.backend.app.contracts.search import GlobalSearchRequest
from proofhire.backend.app.services.search_service import search_service

router = APIRouter()


@router.post("/")
def global_search(request: GlobalSearchRequest):
    return search_service.global_search(query=request.query, types=request.types, limit=request.limit)
