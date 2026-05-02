# Sample Data for Testing

## Sample Resume (PDF)
Download: `https://github.com/yourusername/proofhire/blob/main/docs/sample_resume.pdf`
Content:
- Skills: Python, Django, PostgreSQL
- Experience: Software Engineer at X Corp (2020-2023)

## Sample JD
```text
We are looking for a Python developer with experience in Django and PostgreSQL.
Nice to have: AWS and Kubernetes.
```

## Sample GitHub Username
`aftabsayed` (replace with your username)

## Expected Match Output (Week 3)
```json
{
  "fit_score": 82.4,
  "semantic_similarity": 75.2,
  "matched_skills": {
    "required": ["Python", "Django", "PostgreSQL"],
    "nice_to_have": []
  },
  "missing_skills": {
    "required": [],
    "nice_to_have": ["AWS", "Kubernetes"]
  },
  "skill_confidence": {
    "Python": 1.0,
    "Django": 0.8,
    "PostgreSQL": 0.5
  }
}
```
