# API Reference

Base URL: `/api/v1`

## Auth
- `POST /auth/login`
- `POST /auth/signup`
- `GET /auth/me`

## Users
- `GET /users/`
- `POST /users/`
- `GET /users/{id}`
- `PUT /users/{id}`
- `DELETE /users/{id}`

## Organizations
- `GET /organizations/`
- `POST /organizations/`
- `GET /organizations/{id}`

## Candidates
- `GET /candidates/`
- `POST /candidates/`
- `GET /candidates/{id}`

## Jobs
- `GET /jobs/`
- `POST /jobs/`
- `GET /jobs/{id}`

## Applications
- `GET /applications/`
- `POST /applications/`
- `PATCH /applications/{id}`

## Evidence
- `GET /evidence/candidates/{candidate_id}`
- `POST /evidence/candidates/{candidate_id}`

## Assessments
- `GET /assessments/`
- `POST /assessments/`
- `GET /assessments/{id}`

## Matching
- `POST /matching/jobs/{job_id}/match`

## Search
- `POST /search/`

## Analytics
- `GET /analytics/organizations/{organization_id}/summary`

## Skill Graph
- `GET /skill-graph/organizations/{organization_id}`
- `POST /skill-graph/query`
