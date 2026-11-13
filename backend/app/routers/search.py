from backend.app.contracts.search import GlobalSearchRequest
from backend.app.database import get_db
from backend.app.services.search_service import search_service
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

router = APIRouter()


@router.post("/")
def global_search(request: GlobalSearchRequest, db: Session = Depends(get_db)):
    return search_service.global_search(db, query=request.query, types=request.types, limit=request.limit)

