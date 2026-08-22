# Integrations

## GitHub

Syncs repositories and contributions as evidence.

- `GET /integrations/github/repos/{username}`
- Webhook handler for real-time events

## Greenhouse

ATS integration for job and candidate sync.

## Stripe

Payment processing for subscriptions.

- Webhook handler for payment events
- Customer portal integration

## LinkedIn

Profile import for candidate evidence.

## Generic Webhooks

Inbound webhooks accepted at `/api/v1/webhooks/{provider}`.

## Rate Limiting

All integrations use `rate_limiter` with configurable limits and exponential backoff retry via `retry_policy`.
