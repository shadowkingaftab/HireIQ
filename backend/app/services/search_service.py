from typing import List, Dict, Any
from sqlalchemy.orm import Session
from proofhire.backend.app.models.skill import Skill

class SearchService:
    def global_search(self, db: Session, *, query: str, limit: int = 10) -> List[Dict[str, Any]]:
        # Placeholder for elasticsearch or pg_trgm search
        return []

search_service = SearchService()
