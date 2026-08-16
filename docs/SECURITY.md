# Security

## Authentication

- JWT access tokens (15 min default)
- Refresh tokens with rotation
- BCrypt password hashing

## Authorization

- Role-based access control (RBAC)
- Roles: candidate, recruiter, admin
- Permission checks at router and service layers

## Data Protection

- TLS for all external traffic
- Encrypted database connections
- Secrets managed via environment variables

## Input Validation

- Pydantic schemas for all inputs
- SQL injection prevention via ORM
- XSS prevention via React escaping

## Rate Limiting

- Per-route rate limits
- IP-based throttling
- Redis-backed counters (placeholder)

## Audit Logging

All sensitive operations logged to `audit_logs` with actor, action, and resource context.
