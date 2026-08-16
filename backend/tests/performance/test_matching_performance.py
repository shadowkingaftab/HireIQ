import time
from proofhire.backend.app.matching.matcher import Matcher
from proofhire.backend.app.matching.scorer import Scorer


def test_matching_latency():
    matcher = Matcher()
    scorer = Scorer()
    job = {"id": 1, "skills": ["python", "django", "sql"]}
    candidates = [{"id": i, "skills": ["python", "django", "sql"]} for i in range(100)]
    start = time.time()
    results = matcher.match(job, candidates)
    elapsed = time.time() - start
    assert elapsed < 1.0
    assert len(results) == 100


def test_scoring_throughput():
    scorer = Scorer()
    pairs = [({"skills": ["python"]}, {"skills": ["python", "django"]}) for _ in range(1000)]
    start = time.time()
    scores = [scorer.score(pair[0], pair[1]) for pair in pairs]
    elapsed = time.time() - start
    assert elapsed < 2.0
    assert all(0.0 <= s <= 1.0 for s in scores)
