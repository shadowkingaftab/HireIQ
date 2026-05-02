# API Documentation

## Base URL
`http://localhost:8000`

## Endpoints

### Health Check
- `GET /health` - Check if the API is running.

### Candidates
- `GET /candidates/` - List all candidates.
- `POST /candidates/` - Create a new candidate.
  - Body: `{"name": "...", "email": "...", "github_username": "..."}`
- `GET /candidates/{candidate_id}` - Get details for a specific candidate.

### Skills
- `GET /skills/` - List all skills.
- `POST /skills/` - Create a new skill.
  - Body: `{"name": "...", "category": "..."}`

### Jobs
- `GET /jobs/` - List all jobs.
- `POST /jobs/` - Create a new job.
  - Body: `{"title": "...", "description": "...", "required_skills": ["..."], "nice_to_have_skills": ["..." ]}`

## Week 2 Endpoints

### Parse Resume
- **Endpoint**: `POST /parse-resume/`
- **Request**: Multipart form with `file` (PDF).
- **Response**:
  ```json
  {
    "text": "Full resume text...",
    "skills": ["Python", "Django"],
    "experience": [{"company": "X", "role": "Y", "duration": "Z"}]
  }
  ```

### Parse JD
- **Endpoint**: `POST /parse-jd/`
- **Request**: 
  ```json
  {"text": "Job description text..."}
  ```
- **Response**:
  ```json
  {
    "text": "Job description text...",
    "required_skills": ["Python", "Django"],
    "nice_to_have_skills": ["AWS"]
  }
  ```

### Fetch GitHub
- **Endpoint**: `GET /github/{username}`
- **Response**:
  ```json
  {
    "username": "aftabsayed",
    "repo_count": 5,
    "total_commits": 200,
    "languages": {"Python": 50000, "JavaScript": 20000},
    "repos": [{"name": "proofhire", "url": "...", "stars": 10, "language": "Python"}]
  }
  ```

### Match
- **Endpoint**: `POST /match`
- **Request**:
  ```json
  {
    "candidate_data": {"skills": ["Python", "Django"]},
    "jd_data": {"required_skills": ["Python", "Django"], "nice_to_have_skills": ["AWS"]},
    "github_data": {"languages": {"Python": 50000}}
  }
  ```
- **Response**:
  ```json
  {
    "fit_score": 85.0,
    "semantic_similarity": 78.5,
    "matched_skills": {"required": ["Python", "Django"], "nice_to_have": []},
    "missing_skills": {"required": [], "nice_to_have": ["AWS"]},
    "skill_confidence": {"Python": 0.8, "Django": 0.8}
  }
  ```

## Week 4 New Endpoints

### Assessments
- `GET /assessments/{skill}/{difficulty}` - Get a random assessment.
- `POST /assessments/grade` - Grade a code submission.
  Request:
  ```json
  {
    "assessment_id": "problem_text",
    "code": "candidate_code"
  }
  ```

### Skill Graphs
- `POST /skill-graph/{candidate_id}` - Update/create a skill graph.
  Request:
  ```json
  {
    "skills": ["Python", "Django"],
    "github_data": {"languages": {"Python": 100}}
  }
  ```

### Endorsements
- `POST /endorsements/` - Add a skill endorsement.
  Request:
  ```json
  {
    "candidate_id": "uuid",
    "skill_id": "uuid"
  }
  ```
- `GET /endorsements/{candidate_id}` - Get endorsements for a candidate.
