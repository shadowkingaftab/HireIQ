# Security Controls

## Access Control

- All endpoints require authentication except public pages
- Role-based access: candidate, recruiter, admin
- Organization isolation enforced at data layer
- API key support for programmatic access

## Input Validation

- Pydantic schemas for all inputs
- SQL injection prevention via ORM
- XSS prevention via React escaping
- File upload validation (type, size, virus scan)

## Cryptography

- JWT signed with HS256
- Refresh tokens rotated on use
- Passwords hashed with bcrypt
- Secrets never logged or exposed in responses

## Rate Limiting

- Per-user and per-IP limits
- Redis-backed counters
- Exponential backoff for retries

## Audit Logging

- All sensitive operations logged
- Logs include actor, action, resource, timestamp
- Immutable audit trail

## Vulnerability Management

- Dependencies audited weekly
- Security scanning in CI
- Patch SLA: critical = 24h, high = 7d, medium = 30d
