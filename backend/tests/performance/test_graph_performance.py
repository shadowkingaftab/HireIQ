from proofhire.backend.app.skill_graph.skill_graph import SkillGraph
from proofhire.backend.app.models.skill import Skill


def test_skill_graph_operations():
    graph = SkillGraph()
    graph.add_skill(Skill(id="python", name="Python"))
    graph.add_skill(Skill(id="django", name="Django"))
    graph.add_edge("python", "django", "requires")
    assert graph.has_path("python", "django")
    assert graph.get_related_skills("python") == ["django"]


def test_graph_degree():
    graph = SkillGraph()
    for i in range(100):
        graph.add_skill(Skill(id=str(i), name=str(i)))
    for i in range(1, 100):
        graph.add_edge(str(0), str(i), "requires")
    related = graph.get_related_skills("0")
    assert len(related) == 99
