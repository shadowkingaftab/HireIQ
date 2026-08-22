# Rollback Procedure

## Steps
1. Identify last known good deployment
2. Trigger rollback via Render dashboard or CLI
3. Verify health endpoints return OK
4. Run database migration check
5. Notify team

## Automated
Rollback is automatic if health check fails after deployment.
