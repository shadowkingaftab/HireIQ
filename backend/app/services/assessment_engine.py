from ..models.assessment import Assessment, CandidateAssessment
from ..database import SessionLocal
from sqlalchemy.orm import Session
import subprocess
import tempfile
import os
import random

# Sample problems with variants for anti-cheating
ASSESSMENT_BANK = {
    "Python": {
        "easy": [
            {
                "id": "py-easy-1",
                "problem": "Write a function to reverse a string.",
                "solution": "def reverse_string(s): return s[::-1]",
                "test_cases": [
                    {"input": '"hello"', "output": '"olleh"'},
                    {"input": '"world"', "output": '"dlrow"'}
                ],
                "variants": [
                    "Write a function that returns a given string in reverse order.",
                    "Implement a function to reverse the characters in a string."
                ]
            },
            {
                "id": "py-easy-2",
                "problem": "Write a function to find the factorial of a number.",
                "solution": "def factorial(n): return 1 if n <= 1 else n * factorial(n-1)",
                "test_cases": [
                    {"input": "5", "output": "120"},
                    {"input": "0", "output": "1"}
                ],
                "variants": [
                    "Implement a factorial function.",
                    "Write code to compute the factorial of a given integer."
                ]
            }
        ],
        "medium": [
            {
                "id": "py-medium-1",
                "problem": "Write a function to find the longest common prefix in a list of strings.",
                "solution": "def longest_common_prefix(strs):\n    if not strs: return ''\n    prefix = strs[0]\n    for s in strs[1:]:\n        while s[:len(prefix)] != prefix:\n            prefix = prefix[:-1]\n            if not prefix: return ''\n    return prefix",
                "test_cases": [
                    {"input": '["flower","flow","flight"]', "output": '"fl"'},
                    {"input": '["dog","racecar","car"]', "output": '""'}
                ],
                "variants": [
                    "Find the longest common prefix among an array of strings.",
                    "Write a script that computes the common starting prefix for a list of words."
                ]
            }
        ],
        "hard": [
            {
                "id": "py-hard-1",
                "problem": "Write a function to find the maximum subarray sum (Kadane's Algorithm).",
                "solution": "def max_subarray_sum(nums):\n    max_so_far = nums[0]\n    current_max = nums[0]\n    for x in nums[1:]:\n        current_max = max(x, current_max + x)\n        max_so_far = max(max_so_far, current_max)\n    return max_so_far",
                "test_cases": [
                    {"input": '[-2,1,-3,4,-1,2,1,-5,4]', "output": "6"},
                    {"input": '[1]', "output": "1"},
                    {"input": '[5,4,-1,7,8]', "output": "23"}
                ],
                "variants": [
                    "Implement Kadane's algorithm to find the maximum contiguous subarray sum.",
                    "Write a function that takes an array of integers and finds the contiguous subarray with the largest sum."
                ]
            }
        ]
    }
}

def get_user_seen_questions(user_id: str) -> set:
    """Retrieve questions the user has already seen."""
    # Placeholder: In a real app, fetch from DB
    return set()

def log_seen_question(user_id: str, question_id: str):
    """Log that a user has seen a question."""
    # Placeholder: In a real app, save to DB
    pass

def get_random_question(skill: str, difficulty: str) -> dict:
    """Select a random question from the bank."""
    if skill not in ASSESSMENT_BANK or difficulty not in ASSESSMENT_BANK[skill]:
        return None
    return random.choice(ASSESSMENT_BANK[skill][difficulty])

def generate_assessment(skill: str, difficulty: str = "medium", user_id: str = None) -> dict:
    """Generate a random assessment for a skill with anti-cheating measures."""
    question = get_random_question(skill, difficulty)
    
    # Track which questions the user has seen to avoid repeats
    if user_id:
        seen_questions = get_user_seen_questions(user_id)
        # Assuming bank is large enough to not loop infinitely
        attempts = 0
        while question and question["id"] in seen_questions and attempts < 10:
            question = get_random_question(skill, difficulty)
            attempts += 1
        if question:
            log_seen_question(user_id, question["id"])

    if not question:
        return None

    # Clone the question so we don't modify the bank
    question_data = dict(question)

    # Randomly select a variant (if available)
    if "variants" in question_data and question_data["variants"]:
        # Add original problem to choices
        choices = [question_data["problem"]] + question_data["variants"]
        question_data["problem"] = random.choice(choices)

    # Add random suffix to ID
    question_data["id"] = f"{question_data['id']}-{random.randint(1000, 9999)}"
    
    return question_data

def grade_assessment(submission: str, assessment: dict) -> dict:
    """Grade a candidate's submission against test cases."""
    passed = 0
    total = len(assessment["test_cases"])

    for test_case in assessment["test_cases"]:
        try:
            # Create a temporary file with the submission + test case
            with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
                f.write(submission + "\n")
                # Wrap input in print to capture output
                f.write(f"import json\n")
                f.write(f"if 'reverse_string' in globals(): print(reverse_string({test_case['input']}))\n")
                f.write(f"elif 'longest_common_prefix' in globals(): print(longest_common_prefix({test_case['input']}))\n")
                f.write(f"elif 'max_subarray_sum' in globals(): print(max_subarray_sum({test_case['input']}))\n")

            # Execute the code
            result = subprocess.run(
                ["python", f.name],
                capture_output=True,
                text=True,
                timeout=5
            )

            # Compare output
            if result.stdout.strip() == test_case["output"].strip().strip('"').strip("'"):
                passed += 1

            os.unlink(f.name)
        except Exception as e:
            print(f"Error grading test case: {e}")
            continue

    score = (passed / total) * 100 if total > 0 else 0
    return {
        "passed": passed == total and total > 0,
        "score": score,
        "passed_tests": passed,
        "total_tests": total
    }
