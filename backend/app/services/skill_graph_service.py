from typing import List, Dict, Any
from sqlalchemy.orm import Session
from proofhire.backend.app.repositories.graph_repository import graph_repository

class SkillGraphService:
    def get_skill_neighborhood(self, db: Session, *, skill_id: str, depth: int = 1) -> Dict[str, Any]:
        nodes = graph_repository.get_related_skills(db, skill_id=skill_id, depth=depth)
        return {
            "root": skill_id,
            "related": nodes
        }

    def suggest_related_skills(self, db: Session, *, skill_ids: List[str]) -> List[str]:
        suggestions = set()
        for s_id in skill_ids:
            related = graph_repository.get_related_skills(db, skill_id=s_id)
            for r in related:
                suggestions.add(r["skill_id"])
        return list(suggestions.difference(set(skill_ids)))

skill_graph_service = SkillGraphService()
