from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from proofhire.backend.app.skill_graph.graph_builder import graph_builder
from proofhire.backend.app.skill_graph.graph_query import graph_query
from proofhire.backend.app.skill_graph.gap_analyzer import gap_analyzer

class SkillGraphService:
    def list_skills(self, db: Session) -> List[Dict[str, Any]]:
        return []

    def get_organization_graph(self, db: Session, *, organization_id: int) -> Dict[str, Any]:
        return graph_builder if hasattr(graph_builder, "build_for_organization") else {"nodes": [], "edges": []}

    def query(self, *, skill_names: List[str], depth: int = 1) -> Dict[str, Any]:
        return {"nodes": [], "edges": []}

    def analyze_gaps(self, *, candidate_skills: List[str], job_skills: List[str]) -> Dict[str, Any]:
        return gap_analyzer.analyze(candidate_skills=candidate_skills, job_skills=job_skills)


skill_graph_service = SkillGraphService()
