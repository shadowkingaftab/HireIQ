# Restore Runbook

## Prerequisites
- Access to backup storage
- Database server provisioned
- Application credentials

## Steps
1. Stop application services
2. Restore latest base backup
3. Apply transaction logs
4. Run database migrations
5. Verify data integrity
6. Start application services
7. Run health checks

## Rollback
If restore fails, revert to previous backup and investigate.
