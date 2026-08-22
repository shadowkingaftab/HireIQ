from typing import Any, Dict, Optional
from sqlalchemy.orm import Session

class SearchIndexRepository:
    def get_by_entity(self, db: Session, *, entity_type: str, entity_id: int) -> Optional[Any]:
        return None

    def upsert(self, db: Session, *, entity_type: str, entity_id: int, payload: Dict[str, Any]) -> Any:
        return payload


search_index_repository = SearchIndexRepository()
