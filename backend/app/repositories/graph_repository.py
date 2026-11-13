from typing import Any, Dict

from sqlalchemy.orm import Session


class GraphQueryEngine:
    def query(self, db: Session, *, skill_names: list, depth: int = 1) -> Dict[str, Any]:
        return {"nodes": [], "edges": []}


graph_query_engine = GraphQueryEngine()
