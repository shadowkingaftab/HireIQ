# Database Backup Policy

## Frequency
- Full backup: daily at 02:00 UTC
- WAL archiving: continuous

## Retention
- Daily backups: 14 days
- Weekly backups: 8 weeks
- Monthly backups: 12 months

## Storage
- Backups stored in S3-compatible object storage
- Encryption at rest enabled
- Cross-region replication for production

## Restore
- RTO: 2 hours
- RPO: 15 minutes
- See `restore-runbook.md` for step-by-step restore procedure
