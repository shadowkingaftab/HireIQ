# Secrets Policy

## Purpose

Protect credentials, API keys, and other secrets from exposure.

## Rules

1. Never commit secrets to version control
2. Use environment variables or secret manager for all secrets
3. Rotate secrets on a regular schedule
4. Limit secret access to minimum required principals
5. Audit secret access

## Allowed Storage

- Development: `.env` files (git-ignored)
- Production: Secret manager (Render secrets, AWS Secrets Manager, etc.)

## Prohibited

- Hardcoding secrets in source code
- Committing `.env` files
- Sharing secrets in chat/email
- Logging secrets

## Rotation Schedule

- Database passwords: 90 days
- API keys: 180 days
- JWT secret: 1 year or on compromise
- Third-party tokens: per provider policy

## Incident Response

If a secret is exposed:
1. Rotate immediately
2. Audit access logs
3. Notify security team
4. Document in incident report
