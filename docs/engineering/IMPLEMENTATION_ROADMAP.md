# TariffLookup Implementation Roadmap

## Purpose

This roadmap translates the current product definition into an implementation sequence for TariffLookup.ca.

It is aligned to the MVP described in:

- `docs/product/README.md`
- `docs/product/SCOPE_DEFINITION.md`
- `docs/product/ASSUMPTIONS_CONSTRAINTS.md`

## MVP Summary

- Target users: Canadian exporters and trade consultants
- Core workflow: one product description or one HS code + one destination country -> probable HS code + tariff result
- Initial output:
  - probable HS code
  - MFN tariff rate
  - preferential tariff rate, if applicable
  - agreement basis
  - eligibility notes
- Initial jurisdictions:
  - United States
  - European Union
  - United Kingdom
  - Japan
  - Brazil
  - China

## Initial Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router

### Backend

- Node.js
- TypeScript
- Fastify
- Zod for request/response validation

### Persistence and Auth

- Supabase Postgres
- Supabase Auth

Supabase is reserved for user accounts, saved lookup history, and subscription state. The core tariff lookup logic should remain application-controlled in the backend.

## Delivery Sequence

### Phase 1: Repository and App Baseline

- Scaffold `frontend/` with React + TypeScript + Vite
- Add Tailwind and base application structure
- Scaffold `backend/` with Fastify + TypeScript
- Add shared environment conventions and local dev scripts

### Phase 2: Core Frontend Workflow

- Create routes for:
  - `/`
  - `/login`
  - `/dashboard`
  - `/profile`
  - `/settings`
- Build an MVP-first interface centered on tariff lookup, not generic dashboard chrome
- Add placeholder states for loading, empty results, and errors

### Phase 3: Core Backend API

- Create a health endpoint
- Create a lookup endpoint that accepts:
  - `productDescription`
  - `hsCode`
  - `destinationCountry`
- Return a temporary mocked response shape matching the planned classification + tariff result model
- Add request validation and error handling

### Phase 4: Domain Data Model

- Define initial database tables for:
  - `profiles`
  - `lookup_history`
  - `tariff_schedules`
  - `preferential_rates`
  - `trade_agreements`
  - `eligibility_rules`
- Define source-data conventions under `data/`
- Add schema and normalization documentation under `docs/data-sources/`

### Phase 5: Authentication

- Add Supabase Auth
- Protect dashboard and saved-history flows
- Keep public client configuration in the frontend only where appropriate
- Keep service-role credentials and privileged operations in the backend only

### Phase 6: Real Lookup Logic

- Replace mocked lookup results with tariff schedule queries
- Add agreement matching and eligibility-note generation
- Persist lookup history per authenticated user

### Phase 7: Billing

- Add Stripe subscriptions after the lookup workflow is stable
- Store subscription state in the database
- Restrict paid features in the backend, not only in the frontend

### Phase 8: Reliability and Usability

- Improve error handling
- Improve validation guidance for product description, HS code, and country input
- Add instrumentation, monitoring, and support workflows
- Expand test coverage across frontend, backend, and data logic

## Non-Goals for Initial Build

- OpenAI-driven core tariff determination
- Multi-country comparison in a single request
- Non-tariff barrier summaries
- Landed cost estimation
- Opportunity recommendation engine
- Overbuilt role systems or broad integrations before MVP validation

## Current Repository Status (2026-03-13)

The repository has already moved beyond the initial scaffolding target:

- `frontend/` exists with React, TypeScript, Vite, Tailwind, and route scaffolding for `/`, `/login`, `/dashboard`, `/profile`, and `/settings`
- the home page is now wired to a dataset-backed prototype lookup flow with visible probable-HS-code and tariff result rendering
- `backend/` now uses extracted classification and lookup services behind a thin route layer
- `node` and `npm` are available locally, and frontend/backend builds have been verified successfully
- `data/seed/tariff-records.json` now provides a first local seed/demo tariff dataset for prototype lookups
- `docs/data-sources/` now includes a seed-data note clarifying that the current records are demo-only and not production-grade tariff intelligence
- Step 3 has moved from initial EU ingestion into broader local EU coverage, with raw official Access2Markets snapshots and 13 normalized European Union rows now committed for `8208.30`, `0901.21`, `6109.10`, `9403.60`, `3923.21`, `9403.30`, `3924.10`, `4819.10`, `9403.50`, `7013.49`, `6302.60`, `6302.91`, and `7323.93`
- authentication, persistence, billing, observability, and production-grade test coverage are still pending

## Execution Status And Next Steps

### Step 0: Restore a Working Local Node Environment

Status: complete as of 2026-03-13

- `node` is available on `PATH`
- `npm` is available for workspace package installation and local scripts
- the repository README has been updated to reflect the active implementation baseline
- frontend and backend dependencies/builds have been verified locally

Exit criteria:

- satisfied

### Step 1: Complete the End-to-End Mocked Lookup Flow

Status: complete as of 2026-03-13

- the home page form is wired to the backend `POST /api/lookups` endpoint for description-first lookups
- supported destinations are loaded from `GET /api/meta/markets`
- client-side loading, validation, and error states exist around the live classification + tariff response
- the UI visibly renders a mocked probable HS code plus mocked tariff response from the backend contract

Exit criteria:

- satisfied

### Step 2: Freeze the Lookup Contract and Service Boundaries

Status: complete as of 2026-03-13

- the lookup request shape is frozen around `productDescription?`, `hsCode?`, and `destinationCountry`
- the success response shape is frozen around `query`, `classification`, `result`, and `meta`
- backend classification logic has been extracted into a dedicated service
- backend lookup logic has been extracted into a dataset-backed lookup service
- the route is now focused on validation, orchestration, and HTTP response formatting
- a first local seed tariff dataset now powers actual prototype lookups for seeded HS code and destination pairs
- backend tests cover description-only, hsCode-only, hsCode-plus-description, and validation-error scenarios
- a frontend test confirms the visible result cards update after a lookup

Exit criteria:

- satisfied

### Step 3: Start Real Tariff Data Integration

Status: complete as of 2026-03-13

Selected first real-data jurisdiction: European Union

Current groundwork already in place:

- `data/raw/eu/source-manifest.json` defines the first official EU source package entry points
- `data/raw/eu/access2markets-tariffs-2026-03-13.json` preserves the first official EU tariff payload snapshots used for normalization
- `data/normalized/eu/tariff-records.json` now contains 13 verified local EU rows for `8208.30`, `0901.21`, `6109.10`, `9403.60`, `3923.21`, `9403.30`, `3924.10`, `4819.10`, `9403.50`, `7013.49`, `6302.60`, `6302.91`, and `7323.93`
- `data/schemas/eu-normalized-tariff-record.schema.json` defines the first EU normalized tariff record shape
- backend lookup logic now prefers normalized EU records when available, returns explicit `needs more detail` responses for known ambiguous EU codes, and labels any remaining seed fallback state explicitly
- `docs/data-sources/EU_NORMALIZATION_QUEUE.md` now tracks normalized, blocked, and fallback EU prototype states
- `docs/data-sources/EU_NORMALIZATION_RULES.md` now defines when a 6-digit EU row is safe to collapse into a normalized prototype record

- Document the first source-data package and refresh conventions under `docs/data-sources/`
- Add initial schemas and normalization outputs under `data/schemas/` and `data/normalized/`
- Define and document the first real product-description-to-HS-code classification path
- Implement the European Union end-to-end with real tariff schedule data before expanding to the rest of the market set
- Replace seed/demo result fields with real rate, agreement-basis, and eligibility-note generation for the European Union path first
- expand beyond the first verified EU rows so the European Union path covers a materially useful set of production-priority codes without seed fallback

Exit criteria:

- satisfied

### Step 4: Add Auth and Persistence After the Lookup Flow Is Stable

Status: in progress as of 2026-03-13

- `supabase/migrations/20260313130000_init_auth_and_lookup_history.sql` defines the first `profiles` and `lookup_history` schema
- frontend auth wiring now exists for email/password sign-in when Supabase browser env vars are configured
- account routes now exist for saved lookup history, and the public lookup route can persist successful lookups when a valid bearer token is present
- dashboard, profile, and settings routes are now protected while the public lookup route remains open

- Add Supabase schema and application wiring for `profiles` and `lookup_history`
- Protect saved-history and account routes while keeping the public lookup entry path lightweight
- Persist successful lookups for authenticated users and expose them in the dashboard

Exit criteria:

- authenticated users can review prior lookups without changing the core public lookup workflow

### Step 5: Prepare Reliability, Billing, and Launch Controls

- Add structured logging, monitoring, and failure diagnostics around the lookup path
- Expand automated coverage across UI, API, and data normalization logic
- Provision a cloud-hosted staging environment and stable staging URL before public live-domain launch
- Use the staging URL for QA, pilot access, and release-candidate validation
- Add Stripe only after the tariff-result workflow is trusted and supportable
- Define release, support, and refresh procedures for tariff-data updates

Exit criteria:

- the product can be operated, supported, and monetized without relying on manual intervention, and a stable staging URL exists before live-domain cutover
