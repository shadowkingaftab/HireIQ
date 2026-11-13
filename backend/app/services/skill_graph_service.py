from typing import Any, Dict, List

from backend.app.skill_graph.gap_analyzer import gap_analyzer
from backend.app.skill_graph.graph_builder import graph_builder
from sqlalchemy.orm import Session


class SkillGraphService:
    def list_skills(self, db: Session) -> List[Dict[str, Any]]:
        from backend.app.models.skill import Skill

        return [
            {"id": skill.id, "name": skill.name, "category": skill.category,
             "description": skill.description}
            for skill in db.query(Skill).order_by(Skill.name).all()
        ]

    def get_organization_graph(self, db: Session, *, organization_id: int) -> Dict[str, Any]:
        return graph_builder.snapshot()

    def query(self, *, skill_names: List[str], depth: int = 1) -> Dict[str, Any]:
        graph = graph_builder.snapshot()
        by_name = {str(node.get("name", "")).casefold(): node for node in graph["nodes"]}
        by_id = {str(node["id"]): node for node in graph["nodes"]}
        selected = {str(by_name[name.casefold()]["id"]) for name in skill_names if name.casefold() in by_name}
        frontier = set(selected)
        for _ in range(max(depth, 0)):
            neighbors = {
                str(edge["target"]) if str(edge["source"]) in frontier else str(edge["source"])
                for edge in graph["edges"]
                if str(edge["source"]) in frontier or str(edge["target"]) in frontier
            } - selected
            selected.update(neighbors)
            frontier = neighbors
        edges = [
            edge for edge in graph["edges"]
            if str(edge["source"]) in selected and str(edge["target"]) in selected
        ]
        return {"nodes": [by_id[node_id] for node_id in selected if node_id in by_id], "edges": edges}

    def analyze_gaps(self, *, candidate_skills: List[str], job_skills: List[str]) -> Dict[str, Any]:
        return gap_analyzer.analyze(candidate_skills=candidate_skills, job_skills=job_skills)


skill_graph_service = SkillGraphService()

