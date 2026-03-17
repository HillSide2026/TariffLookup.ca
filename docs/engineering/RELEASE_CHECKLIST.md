# Release Checklist

Use this checklist before any staging release candidate or live-domain cutover.

## Preflight

- Run `npm run verify:release`
- Run `npm run check:env:backend`
- Run `npm run check:env:frontend`
- Review the latest EU normalization/data changes for known gaps
- Review any open issues affecting lookup correctness, auth, or history

## Staging verification

- Deploy the frontend and backend staging services
- Confirm `GET /health` returns `ok` or a known `degraded` state
- Run `npm run check:env:staging`
- Run `npm run smoke:staging`
- Manually verify the staging homepage, login page, dashboard, and a known EU
  normalized lookup

## Go/No-Go review

- Confirm builds and tests are green in CI
- Confirm no unresolved critical bugs in the current release candidate
- Confirm Supabase auth and lookup history are operating normally
- Confirm the tariff data refresh included in the release is documented

## Rollback steps

Frontend rollback:

- revert the Vercel deployment to the last known-good build
- confirm `/`, `/login`, and `/dashboard` render successfully

Backend rollback:

- redeploy the previous Render service version
- confirm `/health` and `/api/ops/metrics` recover
- rerun the signed-in lookup smoke path

Tariff-data rollback:

- restore the previous normalized data file version in `data/normalized/`
- redeploy the backend
- rerun the EU lookup smoke checks against the restored dataset
