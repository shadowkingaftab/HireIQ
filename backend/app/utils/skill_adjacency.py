# Define which skills are related (and how closely)
SKILL_ADJACENCY = {
    "Docker": {
        "Kubernetes": 0.9,  # Highly related
        "AWS": 0.7,
        "CI/CD": 0.8
    },
    "Python": {
        "Django": 0.9,
        "Flask": 0.9,
        "Machine Learning": 0.8,
        "Pandas": 0.8
    },
    "JavaScript": {
        "React": 0.9,
        "Node.js": 0.9,
        "TypeScript": 0.8
    },
}

# Default learning time (in weeks) for unrelated skills
DEFAULT_LEARNING_TIME = 4

def get_learning_time(current_skills: list, target_skill: str) -> dict:
    """Estimate learning time for a target skill based on current skills."""
    min_time = DEFAULT_LEARNING_TIME
    related_skills = []

    for skill in current_skills:
        if skill in SKILL_ADJACENCY and target_skill in SKILL_ADJACENCY[skill]:
            relationship_strength = SKILL_ADJACENCY[skill][target_skill]
            # Stronger relationship = less time
            time = DEFAULT_LEARNING_TIME * (1 - relationship_strength)
            if time < min_time:
                min_time = time
                related_skills = [skill]

    return {
        "time_weeks": max(1, round(min_time)),  # At least 1 week
        "based_on": related_skills,
        "confidence": 0.8 if related_skills else 0.5
    }
