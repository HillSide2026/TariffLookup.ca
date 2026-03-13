# TariffLookup Implementation Roadmap

## Purpose

This roadmap translates the current product definition into an implementation sequence for TariffLookup.ca.

It is aligned to the MVP described in:

- `docs/product/README.md`
- `docs/product/SCOPE_DEFINITION.md`
- `docs/product/ASSUMPTIONS_CONSTRAINTS.md`

## MVP Summary

- Target users: Canadian exporters and trade consultants
- Core workflow: one HS code + one destination country -> tariff result
- Initial output:
  - MFN tariff rate
  - preferential tariff rate, if applicable
  - agreement basis
  - eligibility notes
- Initial jurisdictions:
  - United States
  - European Union
  - United Kingdom
  - Japan
  - South Korea
  - Australia

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
  - `hsCode`
  - `destinationCountry`
- Return a temporary mocked response shape matching the planned tariff result model
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
- Improve validation guidance for HS code and country input
- Add instrumentation, monitoring, and support workflows
- Expand test coverage across frontend, backend, and data logic

## Non-Goals for Initial Build

- OpenAI-driven core tariff determination
- Multi-country comparison in a single request
- Non-tariff barrier summaries
- Landed cost estimation
- Opportunity recommendation engine
- Overbuilt role systems or broad integrations before MVP validation

## Immediate Build Goal

Complete Phase 1 and Phase 2 scaffolding so the repo has:

- a working frontend shell
- a working backend shell
- basic routing
- a product-aligned lookup-first UI direction
- a clear path into real tariff data integration
