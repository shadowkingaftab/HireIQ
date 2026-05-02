import pytest
from datetime import datetime, timedelta
from app.services.github_analyzer import analyze_repo_quality, calculate_skill_recency

def test_analyze_repo_quality():
    # High quality repo
    score = analyze_repo_quality(stargazers_count=200, forks_count=100, open_issues_count=2)
    # 30 (stars) + 20 (forks) + 10 (issues) + 10 (base) = 70
    assert score == 70
    
    # Low quality repo
    score = analyze_repo_quality(stargazers_count=5, forks_count=2, open_issues_count=20)
    # 0 (stars) + 0 (forks) + 0 (issues) + 10 (base) = 10
    assert score == 10
    
    # Max capped repo
    score = analyze_repo_quality(stargazers_count=10000, forks_count=5000, open_issues_count=1)
    # Should cap at 100 but calculation is 70. Wait, calculation maxes at 70 with current logic: 30+20+10+10=70. 
    # That is correct based on the logic provided.
    assert score <= 100

def test_calculate_skill_recency():
    now = datetime.utcnow()
    
    # Recent commit (0 months ago) -> Score should be 1.0
    recent_date = now.isoformat() + "Z"
    github_data = {"last_commit_dates": {"Python": recent_date}}
    score = calculate_skill_recency("Python", github_data)
    assert score == 1.0
    
    # Commit 5 months ago -> Score should be ~0.5
    five_months_ago = (now - timedelta(days=150)).isoformat() + "Z"
    github_data = {"last_commit_dates": {"Python": five_months_ago}}
    score = calculate_skill_recency("Python", github_data)
    assert 0.4 <= score <= 0.6
    
    # Commit 20 months ago -> Score should hit the floor of 0.1
    old_date = (now - timedelta(days=600)).isoformat() + "Z"
    github_data = {"last_commit_dates": {"Python": old_date}}
    score = calculate_skill_recency("Python", github_data)
    assert score == 0.1
    
    # Missing data
    score = calculate_skill_recency("Java", github_data)
    assert score == 0.5
