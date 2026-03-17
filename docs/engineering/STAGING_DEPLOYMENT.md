# Staging Deployment

Step 5 uses the following staging shape:

- frontend host: Vercel
- backend host: Render
- auth and persistence: Supabase

The repo now includes the first staging config artifacts:

- [vercel.json](/Users/matthewlevine/Repos/TariffLookup.ca/vercel.json)
- [render.yaml](/Users/matthewlevine/Repos/TariffLookup.ca/render.yaml)

## Expected staging services

- frontend project: `tarifflookup-ca-staging`
- backend service: `tarifflookup-backend-staging`

## Required staging environment variables

Frontend:

- `VITE_API_BASE_URL`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Backend:

- `APP_ENV=production`
- `LOG_LEVEL=info`
- `FRONTEND_URL`
- `ALLOWED_ORIGINS`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Smoke test inputs

The staging smoke test script expects:

- `STAGING_FRONTEND_URL`
- `STAGING_API_BASE_URL`
- `STAGING_SUPABASE_URL`
- `STAGING_SUPABASE_ANON_KEY`
- `STAGING_TEST_EMAIL`
- `STAGING_TEST_PASSWORD`

Run:

```bash
npm run check:env:staging
npm run smoke:staging
```

## Current status

The staging configuration is now committed in the repo, but the actual cloud
services and stable public staging URLs still require Vercel and Render account
access to provision. That final provisioning step remains external to this
workspace.
