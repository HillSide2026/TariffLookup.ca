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
- the first Supabase auth and lookup-history scaffolding for Step 4

## Near-Term Priorities

- deepen the description-to-HS classification workflow beyond the current prototype rules
- expand real-data coverage beyond the first European Union slice
- connect Supabase locally to enable sign-in and saved lookup history end to end
- continue Step 4 auth, persistence, and account-surface refinement
