# Alembic Migrations

This directory contains Alembic database migration scripts.

## Usage

```bash
alembic revision --autogenerate -m "description"
alembic upgrade head
```

## Notes

- Do not edit migration files after they have been committed.
- Keep migrations idempotent where possible.
- Test migrations on a copy of production data before deploying.
