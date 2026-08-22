import pytest

from proofhire.backend.app.search.ranking import Ranker


def test_ranker_empty_input():
    ranker = Ranker()
    assert ranker.rank_candidates([], "python") == []
    assert ranker.rank_jobs([], "engineer") == []


def test_ranker_scores_descending():
    ranker = Ranker()
    candidates = [
        {"candidate_id": "1", "skills": ["python"], "score": 0.1},
        {"candidate_id": "2", "skills": ["python", "fastapi"], "score": 0.9},
    ]
    ranked = ranker.rank_candidates(candidates, "python")
    assert ranked[0]["candidate_id"] == "2"
    assert ranked[1]["candidate_id"] == "1"
