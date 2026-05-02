from ..models.assessment import Assessment, CandidateAssessment
from ..database import SessionLocal
from sqlalchemy.orm import Session
import subprocess
import tempfile
import os
import random

# Sample problems
ASSESSMENT_BANK = {
    "Python": {
        "easy": [
            {
                "problem": "Write a function to reverse a string.",
                "solution": "def reverse_string(s): return s[::-1]",
                "test_cases": [
                    {"input": '"hello"', "output": '"olleh"'},
                    {"input": '"world"', "output": '"dlrow"'}
                ]
            }
        ],
        "medium": [
            {
                "problem": "Write a function to find the longest common prefix in a list of strings.",
                "solution": "def longest_common_prefix(strs):\n    if not strs: return ''\n    prefix = strs[0]\n    for s in strs[1:]:\n        while s[:len(prefix)] != prefix:\n            prefix = prefix[:-1]\n            if not prefix: return ''\n    return prefix",
                "test_cases": [
                    {"input": '["flower","flow","flight"]', "output": '"fl"'},
                    {"input": '["dog","racecar","car"]', "output": '""'}
                ]
            }
        ],
        "hard": [
            {
                "problem": "Write a function to find the maximum subarray sum (Kadane's Algorithm).",
                "solution": "def max_subarray_sum(nums):\n    max_so_far = nums[0]\n    current_max = nums[0]\n    for x in nums[1:]:\n        current_max = max(x, current_max + x)\n        max_so_far = max(max_so_far, current_max)\n    return max_so_far",
                "test_cases": [
                    {"input": '[-2,1,-3,4,-1,2,1,-5,4]', "output": "6"},
                    {"input": '[1]', "output": "1"},
                    {"input": '[5,4,-1,7,8]', "output": "23"}
                ]
            }
        ]
    }
}

def generate_assessment(skill: str, difficulty: str = "medium") -> dict:
    """Generate a random assessment for a skill."""
    if skill not in ASSESSMENT_BANK or difficulty not in ASSESSMENT_BANK[skill]:
        return None
    return random.choice(ASSESSMENT_BANK[skill][difficulty])

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
