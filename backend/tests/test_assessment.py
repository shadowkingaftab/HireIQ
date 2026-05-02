import pytest
from app.services.assessment_engine import generate_assessment, ASSESSMENT_BANK

def test_generate_assessment_success():
    # Should get a random medium python assessment
    assessment = generate_assessment("Python", "medium")
    assert assessment is not None
    assert assessment["id"].startswith("py-medium-1-")
    assert len(assessment["id"].split("-")) == 4 # py, medium, 1, random_number
    
    # Should include a variant if available
    original_problem = "Write a function to find the longest common prefix in a list of strings."
    variants = [
        "Find the longest common prefix among an array of strings.",
        "Write a script that computes the common starting prefix for a list of words."
    ]
    possible_problems = [original_problem] + variants
    assert assessment["problem"] in possible_problems

def test_generate_assessment_not_found():
    # Invalid skill
    assessment = generate_assessment("Java", "medium")
    assert assessment is None
    
    # Invalid difficulty
    assessment = generate_assessment("Python", "extreme")
    assert assessment is None
    
def test_generate_assessment_with_user():
    # In a real app this would query the DB
    # For now we're just checking it accepts the parameter
    assessment = generate_assessment("Python", "easy", user_id="test-user-123")
    assert assessment is not None
    assert assessment["id"].startswith("py-easy-")
