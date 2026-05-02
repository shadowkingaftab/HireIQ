from datetime import datetime

def analyze_repo_quality(stargazers_count: int, forks_count: int, open_issues_count: int) -> int:
    """Analyze the quality of a GitHub repository and return a score from 0 to 100."""
    score = 0
    if stargazers_count > 100: 
        score += 30
    elif stargazers_count > 10:
        score += 15
        
    if forks_count > 50: 
        score += 20
    elif forks_count > 10:
        score += 10
        
    if open_issues_count < 5: 
        score += 10  # Well-maintained
        
    # Additional base score just for having the repo
    score += 10
    
    return min(score, 100)  # Cap at 100

def calculate_skill_recency(skill: str, github_data: dict) -> float:
    """Calculate a recency score (0.1 to 1.0) for a skill based on last commit date."""
    last_used_str = github_data.get("last_commit_dates", {}).get(skill)
    if not last_used_str:
        return 0.5  # Default if no GitHub data or date
        
    try:
        # Assuming last_used is ISO format string "YYYY-MM-DDTHH:MM:SSZ"
        last_used = datetime.fromisoformat(last_used_str.replace('Z', '+00:00'))
        # Using a naive datetime for comparison or converting to UTC
        now = datetime.utcnow()
        if last_used.tzinfo:
            now = now.astimezone(last_used.tzinfo)
            
        months_since_use = (now - last_used).days / 30.0
        return max(0.1, 1.0 - (months_since_use * 0.1))  # Decay by 10% per month
    except Exception:
        return 0.5
