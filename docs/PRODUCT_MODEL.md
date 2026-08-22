# Product Model

## Core Entities

### User
Base account entity with roles.

### Candidate
Extended profile with skills, evidence, and applications.

### Recruiter
Hiring user with organization context and preferences.

### Organization
Tenant entity containing jobs, candidates, and teams.

### Job
Position with requirements, skills, and application pipeline.

### Application
Candidate's application to a job with matching score.

### Evidence
Verifiable artifact linked to a candidate.

### Assessment
Evaluation with questions, timer, and anti-cheat.

### MatchResult
Scored match between candidate and job with explanation.

## Key Workflows

1. Candidate signs up, links GitHub/resume
2. Evidence ingested and normalized
3. Skills extracted and graph-built
4. Recruiter creates job
5. Matching engine ranks candidates
6. Recruiter reviews matches with evidence
7. Assessment sent if needed
8. Interview scheduled
9. Offer extended
