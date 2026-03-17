# Step 5 Observability And Monitoring

Step 5 now includes a first operational observability layer for the lookup and
account flows.

## Backend logging

The backend emits structured logs for:

- lookup start
- lookup completion
- lookup failure
- auth verification success and failure
- lookup-history persistence outcomes
- account lookup-history load success and failure

The logs intentionally include request ID, route, method, destination, resolved
HS code, source tier, coverage status, latency, and persistence outcome.

The logs intentionally exclude bearer tokens, Supabase keys, and other secrets.

## Backend monitoring endpoints

- `GET /health`
- `GET /api/ops/metrics`

`/health` returns a top-level `status` of `ok` or `degraded`, plus the recent
reason list and monitoring summary.

`/api/ops/metrics` returns the in-memory monitoring snapshot, including:

- lookup totals, latency, and outcome counts
- auth verification totals and failure rates
- lookup-history persistence status counts
- account history API failure rates
- product-signal counts for `local-normalized-data`, `seed-demo-data`, and
  `needs-more-detail`
- recent consecutive 5xx count

## Thresholds

The current MVP thresholds are configured with environment variables:

- `MONITORING_WINDOW_MINUTES`
- `MONITORING_LOOKUP_ERROR_RATE_THRESHOLD`
- `MONITORING_AUTH_FAILURE_RATE_THRESHOLD`
- `MONITORING_HISTORY_API_FAILURE_RATE_THRESHOLD`
- `MONITORING_CONSECUTIVE_5XX_THRESHOLD`

These thresholds currently mark the service as `degraded` in the JSON health
response. They do not yet trigger an external paging or notification system.

## Frontend error logging

The frontend now records lightweight client failures for:

- market-list load failures
- lookup request failures
- known `needs more detail` lookup pauses
- sign-in failures
- dashboard history load failures
- saved-session restore failures

These failures are written to the browser console and retained in a short in-page
buffer at `window.__tarifflookupClientFailures` for local debugging and QA.

## Current limitation

The monitoring layer is intentionally lightweight and in-memory. It resets on
backend restart and is appropriate for staging and MVP operations, not for
long-term production analytics.
