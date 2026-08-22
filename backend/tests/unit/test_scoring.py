from proofhire.backend.app.matching.scorer import Scorer


def test_skill_overlap_scoring():
    scorer = Scorer()
    job = {"skills": ["python", "sql", "docker"]}
    candidate = {"skills": ["python", "sql"]}
    score = scorer.score(job, candidate)
    assert round(score, 2) == round(2 / 3, 2)


def test_no_skill_overlap():
    scorer = Scorer()
    job = {"skills": ["python"]}
    candidate = {"skills": ["java"]}
    score = scorer.score(job, candidate)
    assert score == 0.0


def test_exact_match():
    scorer = Scorer()
    job = {"skills": ["python", "django"]}
    candidate = {"skills": ["python", "django"]}
    score = scorer.score(job, candidate)
    assert score == 1.0
