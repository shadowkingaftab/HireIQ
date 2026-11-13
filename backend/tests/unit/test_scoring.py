from backend.app.matching.graph_matcher import GraphMatcher


def test_skill_overlap_scoring():
    scorer = GraphMatcher()
    job = {"skills": ["python", "sql", "docker"]}
    candidate = {"skills": ["python", "sql"]}
    result = scorer.match(job=job, candidate=candidate)
    assert round(result["score"], 2) == round(2 / 3, 2)


def test_no_skill_overlap():
    scorer = GraphMatcher()
    job = {"skills": ["python"]}
    candidate = {"skills": ["java"]}
    result = scorer.match(job=job, candidate=candidate)
    assert result["score"] == 0.0


def test_exact_match():
    scorer = GraphMatcher()
    job = {"skills": ["python", "django"]}
    candidate = {"skills": ["python", "django"]}
    result = scorer.match(job=job, candidate=candidate)
    assert result["score"] == 1.0

