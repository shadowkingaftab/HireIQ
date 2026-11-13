import time

from backend.app.matching.capability_matcher import CapabilityMatcher
from backend.app.search.ranking import Ranker


def test_matching_latency():
    matcher = CapabilityMatcher()
    job = {"id": 1, "skills": ["python", "django", "sql"]}
    candidates = [{"id": i, "skills": ["python", "django", "sql"]} for i in range(100)]
    start = time.time()
    results = [matcher.match(job=job, candidate=candidate) for candidate in candidates]
    elapsed = time.time() - start
    assert elapsed < 1.0
    assert len(results) == 100


def test_scoring_throughput():
    ranker = Ranker()
    candidates = [{"skills": ["python", "django"], "score": i / 1000} for i in range(1000)]
    start = time.time()
    results = ranker.rank_candidates(candidates, "python")
    elapsed = time.time() - start
    assert elapsed < 2.0
    assert all(0.0 <= candidate["score"] <= 1.0 for candidate in results)

