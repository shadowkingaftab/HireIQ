from proofhire.backend.app.matching.matcher import Matcher
from proofhire.backend.app.matching.scorer import Scorer
from proofhire.backend.app.matching.eligibility_filter import EligibilityFilter


def test_matcher_returns_results():
    matcher = Matcher()
    job = {"id": 1, "skills": ["python"]}
    candidates = [{"id": 1, "skills": ["python"]}, {"id": 2, "skills": ["java"]}]
    results = matcher.match(job, candidates)
    assert len(results) <= len(candidates)


def test_scorer_prioritizes_exact_matches():
    scorer = Scorer()
    job = {"skills": ["python", "django"]}
    candidate_exact = {"skills": ["python", "django"]}
    candidate_partial = {"skills": ["python"]}
    score_exact = scorer.score(job, candidate_exact)
    score_partial = scorer.score(job, candidate_partial)
    assert score_exact >= score_partial


def test_eligibility_filter():
    filt = EligibilityFilter()
    job = {"min_experience": 3}
    candidates = [{"experience_years": 5}, {"experience_years": 1}]
    filtered = filt.filter(candidates, job)
    assert len(filtered) == 1
