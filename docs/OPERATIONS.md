# Operations

## Monitoring

- Health: `/api/v1/health`
- Readiness: `/api/v1/health/ready`
- Liveness: `/api/v1/health/alive`

## Logging

Structured JSON logs via `core/logging.py`. Log levels configurable via `LOG_LEVEL`.

## Metrics

Prometheus metrics exposed at `/metrics`.

## Tracing

OpenTelemetry spans for request tracing. Configurable export to OTLP endpoint.

## Alerting

- Error rate threshold
- Latency p99 threshold
- Queue depth threshold
- Model accuracy drift

## Backup

- Daily database backups
- Evidence snapshots
- Retention policy enforcement

## Incident Response

1. Check health endpoints
2. Review recent logs
3. Check deployment history
4. Rollback if needed
