from fastapi import APIRouter, Depends
from backend.app.contracts.search import GlobalSearchRequest
from backend.app.services.search_service import search_service

router = APIRouter()


@router.post("/")
def global_search(request: GlobalSearchRequest):
    return search_service.global_search(query=request.query, types=request.types, limit=request.limit)

