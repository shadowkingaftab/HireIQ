# Database

## Schema

### Core Tables
- `users` - user accounts
- `roles` - RBAC roles
- `permissions` - fine-grained permissions
- `user_roles` - many-to-many user-role mapping
- `role_permissions` - many-to-many role-permission mapping
- `refresh_tokens` - JWT refresh tokens
- `organizations` - tenant organizations
- `organization_members` - org membership
- `teams` - teams within organizations
- `team_members` - many-to-many team membership

### Candidate Tables
- `candidates` - candidate profiles
- `evidence` - evidence items
- `evidence_sources` - evidence providers
- `evidence_skill_links` - skill links from evidence
- `evidence_snapshots` - point-in-time snapshots
- `external_accounts` - linked accounts (GitHub, LinkedIn)
- `contributions` - repository contributions
- `repositories` - linked repositories
- `skills` - skill catalog
- `skill_relationships` - skill graph edges
- `capability_scores` - inferred capability scores
- `endorsements` - skill endorsements
- `candidate_notes` - recruiter notes

### Job Tables
- `jobs` - job postings
- `applications` - candidate applications
- `match_results` - matching results
- `match_explanations` - match explanations
- `assessments` - assessment definitions
- `coding_sessions` - coding assessment sessions

### Recruiting Tables
- `recruiters` - recruiter profiles
- `interviews` - interview schedules
- `interview_questions` - interview questions
- `feedback` - interview feedback
- `recommendations` - candidate recommendations

### Operational Tables
- `notifications` - user notifications
- `invitations` - org invitations
- `integrations` - third-party integrations
- `integration_connections` - connection configs
- `audit_logs` - audit trail
- `data_consents` - GDPR consent records
- `subscriptions` - billing subscriptions
- `reports` - generated reports
- `certifications` - candidate certifications
- `achievements` - user achievements
- `projects` - candidate projects
- `portfolios` - candidate portfolios
- `api_keys` - API access keys
- `activity_logs` - user activity
- `webhook_events` - inbound webhooks
- `search_indices` - search index snapshots
- `score_versions` - scoring algorithm versions
- `file_assets` - uploaded files
- `recruiter_preferences` - recruiter settings
- `skill_graph_metadata` - graph versioning

## Migrations

Managed by Alembic. See `migrations/` for schema history.
