# Threat Model

## System Overview

ProofHire is a multi-tenant hiring intelligence platform. The system ingests candidate evidence from external sources, computes match scores, and presents explainable results to recruiters.

## Actors

- Candidate
- Recruiter
- Admin
- External provider (GitHub, LinkedIn, etc.)
- System worker

## Trust Boundaries

1. Client → API (TLS)
2. API → Database (private network)
3. API → Cache (private network)
4. API → External providers (outbound HTTPS)
5. Worker → Queue (private network)

## Threats

| Threat | Impact | Likelihood | Mitigation |
|--------|--------|------------|------------|
| Unauthorized access to candidate data | High | Medium | RBAC, tenant isolation, audit logging |
| Tampering with match scores | High | Low | Versioned scoring, immutable audit trail |
| Data leakage between tenants | High | Low | Row-level security, organization isolation |
| DoS via expensive AI requests | Medium | Medium | Rate limiting, circuit breakers |
| Evidence poisoning | High | Low | Provenance tracking, verification workflows |
| Code execution in assessments | High | Medium | Sandboxed execution, resource limits |

## Controls

- Authentication: JWT + refresh tokens
- Authorization: RBAC with fine-grained permissions
- Transport: TLS 1.3
- Data at rest: Encrypted database volumes
- Secrets: Environment variables / secret manager
- Monitoring: Prometheus + alerts
