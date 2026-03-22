# TariffLookup.ca

TariffLookup.ca is a SaaS product for Canadian exporters evaluating tariffs in foreign markets.

The product is aimed at businesses and trade advisors who need a fast way to check tariff treatment for a specific product in a specific destination market.

## MVP Definition

- Input: one crude product description or one HS code, plus one destination country per query
- Output:
  - probable HS code
  - MFN tariff rate
  - preferential tariff rate, if applicable
  - agreement basis, if applicable
  - eligibility notes
- Initial jurisdiction scope:
  - United States
  - European Union
  - United Kingdom
  - Japan
  - Brazil
  - China

## Current Execution Target (2026-03-22)

The current implementation stage is now tracked as an EU-only coverage program with an HS-6 floor of about `5,000` commodity groups.

The current source of truth for completion tracking is:

- `docs/product/EU_MVP_COMPLETION_TARGET.md`
- `docs/data-sources/EU_COVERAGE_TARGET_STATE.md`

## Repository Purpose

This repository is the software build workspace for TariffLookup.ca.

The active target structure is:

- `frontend/` for the web application and customer-facing UI
- `backend/` for APIs, services, business logic, and tariff-query logic
- `data/` for source data, normalized data, schemas, and transformation assets
- `docs/` for product, engineering, and decision documentation
- `tests/` for automated test coverage

## Product Documentation

Current product-planning material lives in `docs/product/`.

Key files include:

- `docs/product/README.md`
- `docs/product/SCOPE_DEFINITION.md`
- `docs/product/ASSUMPTIONS_CONSTRAINTS.md`
- `docs/product/WORKPLAN.md`

## Current Status

This repo now contains an active frontend and backend MVP, including:

- a description-first lookup flow
- a first real-data European Union tariff slice
- explicit EU normalized, fallback, and needs-more-detail states
- live Supabase auth and saved lookup history for the Step 4 account flow
- browser-saved workflow defaults across the signed-in account surfaces
- backend health, metrics, structured logging, and client-side failure logging for Step 5 operations
- release, staging, and tariff-data refresh runbooks committed in `docs/engineering/`
- `31` live normalized EU rows in `data/normalized/eu/tariff-records.json`

## Near-Term Priorities

- deepen the description-to-HS classification workflow beyond the current prototype rules
- expand trustworthy EU coverage toward the HS-6 floor defined in `docs/product/EU_MVP_COMPLETION_TARGET.md`
- provision the actual cloud-hosted staging services and stable staging URL
- enter the staging env vars into Vercel and Render, then run the staging smoke test
- connect the new health and metrics outputs to an external uptime or alerting destination
- defer Stripe until the tariff-result workflow is stable in staging
