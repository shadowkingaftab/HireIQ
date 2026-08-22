from proofhire.backend.app.services.assessment_service import AssessmentService
from proofhire.backend.app.matching.scorer import Scorer
from proofhire.backend.app.skill_graph.skill_graph import SkillGraph


def test_assessment_generation():
    service = AssessmentService()
    job = {"skills": ["python", "sql"]}
    assessment = service.generate_for_job(job)
    assert "questions" in assessment
    assert len(assessment["questions"]) > 0


def test_scoring_range():
    scorer = Scorer()
    score = scorer.score({"skills": ["python"]}, {"skills": ["python", "django"]})
    assert 0.0 <= score <= 1.0


def test_skill_graph_traversal():
    graph = SkillGraph()
    graph.add_skill(graph.Skill(id="a", name="A"))
    graph.add_skill(graph.Skill(id="b", name="B"))
    graph.add_edge("a", "b", "requires")
    assert graph.has_path("a", "b")
