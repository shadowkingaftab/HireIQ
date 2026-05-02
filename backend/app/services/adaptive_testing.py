from .assessment_engine import generate_assessment

# Difficulty levels
DIFFICULTY_LEVELS = ["easy", "medium", "hard"]

def get_next_difficulty(current_difficulty: str, passed: bool) -> str:
    """Determine the next difficulty level based on performance."""
    try:
        current_index = DIFFICULTY_LEVELS.index(current_difficulty.lower())
    except ValueError:
        current_index = 1  # Default to medium if invalid

    if passed:
        # If passed, increase difficulty (but not beyond hard)
        next_index = min(current_index + 1, len(DIFFICULTY_LEVELS) - 1)
    else:
        # If failed, decrease difficulty (but not below easy)
        next_index = max(current_index - 1, 0)

    return DIFFICULTY_LEVELS[next_index]

def generate_adaptive_assessment(skill: str, current_difficulty: str = "medium", passed: bool = None) -> dict:
    """Generate an assessment with adaptive difficulty."""
    next_difficulty = current_difficulty
    if passed is not None:
        next_difficulty = get_next_difficulty(current_difficulty, passed)

    assessment = generate_assessment(skill, next_difficulty)
    if assessment:
        # Create a copy and add the next_difficulty field
        assessment_copy = assessment.copy()
        assessment_copy["next_difficulty"] = next_difficulty
        return assessment_copy
    return None
