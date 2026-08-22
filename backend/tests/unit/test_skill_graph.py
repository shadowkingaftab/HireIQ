import pytest

from proofhire.backend.app.utils.skill_ontology import SkillOntology
from proofhire.backend.app.utils.skill_adjacency import SkillAdjacency


def test_skill_ontology_normalize():
    ontology = SkillOntology()
    ontology.register_skill("Python", aliases=["python3", "py"])
    assert ontology.normalize("python3") == "python"
    assert ontology.normalize("py") == "python"
    assert ontology.normalize("Java") == "java"


def test_skill_adjacency_neighbors():
    graph = SkillAdjacency()
    graph.add_edge("python", "django")
    graph.add_edge("python", "fastapi")
    assert graph.neighbors("python") == {"django", "fastapi"}
    assert graph.neighbors("java") == set()
