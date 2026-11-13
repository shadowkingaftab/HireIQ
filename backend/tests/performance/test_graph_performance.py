from backend.app.skill_graph.graph_builder import SkillGraph


def test_skill_graph_operations():
    graph = SkillGraph()
    graph.add_node("python", {"name": "Python"})
    graph.add_node("django", {"name": "Django"})
    graph.add_edge("python", "django", "requires")
    assert graph.shortest_path("python", "django") == ["python", "django"]
    assert graph.neighbors("python") == [{"name": "Django"}]


def test_graph_degree():
    graph = SkillGraph()
    for i in range(100):
        graph.add_node(str(i), {"name": str(i)})
    for i in range(1, 100):
        graph.add_edge("0", str(i), "requires")
    assert len(graph.neighbors("0")) == 99

