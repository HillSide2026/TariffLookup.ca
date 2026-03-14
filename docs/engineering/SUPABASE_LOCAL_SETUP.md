# Supabase Local Setup

Step 4 now includes the first application wiring for Supabase auth and lookup-history persistence.

## Required Environment

Backend:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Frontend:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Shared local API:

- `VITE_API_BASE_URL`
- `FRONTEND_URL`

## Migration

Apply the first schema under:

- `supabase/migrations/20260313130000_init_auth_and_lookup_history.sql`

That migration creates:

- `public.profiles`
- `public.lookup_history`

It also adds:

- an `auth.users` trigger that upserts `public.profiles`
- row-level-security policies for profile and lookup-history access

## Current Behavior

- The public lookup page still works without Supabase.
- Signed-in browser sessions send the bearer token to the backend.
- The backend saves successful lookups when Supabase is configured.
- `/api/account/lookups` returns saved lookup history for authenticated users.
- If Supabase is not configured locally, login remains disabled and dashboard history returns a configuration message instead of pretending persistence exists.
