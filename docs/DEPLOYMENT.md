# Deployment

## Environments

- Development: local Docker Compose
- Staging: Render private preview
- Production: Render with autoscaling

## Docker

```bash
docker build -t proofhire-backend ./backend
docker run -p 8000:8000 proofhire-backend
```

## Render

`render.yaml` provisions:
- Web service for API
- PostgreSQL database
- Redis cache

## CI/CD

GitHub Actions workflows:
- `backend-ci.yml` - lint, typecheck, test
- `frontend-ci.yml` - lint, build, test
- `e2e.yml` - Playwright tests
- `security.yml` - SAST/DAST
- `dependency-audit.yml` - Snyk checks
- `database-check.yml` - migration lint
- `deploy.yml` - production deploy

## Environment Variables

See `.env.example` in backend and frontend.

## Migrations

```bash
cd backend
alembic revision --autogenerate -m "message"
alembic upgrade head
```
