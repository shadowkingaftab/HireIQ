from ..models.skill_graph import SkillGraph
from sqlalchemy.orm import Session
import networkx as nx
import json

def build_skill_graph(candidate_id: str, skills: list, github_data: dict = None) -> dict:
    """Build a skill graph for a candidate."""
    graph = nx.Graph()

    # Add nodes with weights
    for skill in skills:
        weight = 0.5  # Base weight from resume
        if github_data and skill in github_data.get("languages", {}):
            weight += 0.3  # Boost for GitHub evidence
        graph.add_node(skill, weight=weight, category="Language")  # Default category

    # Add edges
    for i, skill1 in enumerate(skills):
        for skill2 in skills[i+1:]:
            # For now, just connect all skills with small weights
            graph.add_edge(skill1, skill2, weight=0.1)

    # Convert to JSON-serializable format
    nodes = {
        node: {"weight": graph.nodes[node]["weight"], **graph.nodes[node]}
        for node in graph.nodes
    }
    edges = [
        {"source": u, "target": v, "weight": graph.edges[u, v]["weight"]}
        for u, v in graph.edges
    ]

    return {"nodes": nodes, "edges": edges}

def update_skill_graph(db: Session, candidate_id: str, skills: list, github_data: dict = None):
    """Update or create a skill graph for a candidate."""
    graph_data = build_skill_graph(candidate_id, skills, github_data)

    # Check if graph exists
    existing_graph = db.query(SkillGraph).filter(SkillGraph.candidate_id == candidate_id).first()
    if existing_graph:
        existing_graph.nodes = graph_data["nodes"]
        existing_graph.edges = graph_data["edges"]
    else:
        existing_graph = SkillGraph(
            candidate_id=candidate_id,
            nodes=graph_data["nodes"],
            edges=graph_data["edges"]
        )
        db.add(existing_graph)

    db.commit()
    db.refresh(existing_graph)
    return existing_graph
