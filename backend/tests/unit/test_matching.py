from backend.app.matching.capability_matcher import CapabilityMatcher
from backend.app.matching.ranking_pipeline import RankingPipeline


def test_capability_matcher_reports_overlap_and_missing_skills():
    matcher = CapabilityMatcher()
    result = matcher.match(
        job={"skills": ["python", "sql"]},
        candidate={"skills": ["python"]},
    )
    assert result["matched_skills"] == ["python"]
    assert result["missing_skills"] == ["sql"]
    assert 0.0 < result["score"] <= 1.0


def test_ranking_pipeline_sorts_highest_score_first():
    results = RankingPipeline().rank_results([{"score": 0.2}, {"score": 0.9}, {"score": 0.5}])
    assert [item["score"] for item in results] == [0.9, 0.5, 0.2]

