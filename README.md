# TariffLookup.ca

TariffLookup.ca is a SaaS product for Canadian exporters evaluating tariffs in foreign markets.

The product is aimed at businesses and trade advisors who need a fast way to check tariff treatment for a specific product in a specific destination market.

## MVP Definition

- Input: one HS code and one destination country per query
- Output:
  - MFN tariff rate
  - preferential tariff rate, if applicable
  - agreement basis, if applicable
  - eligibility notes
- Initial jurisdiction scope:
  - United States
  - European Union
  - United Kingdom
  - Japan
  - South Korea
  - Australia

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

This repo is being reset into a clean product codebase. The legacy legal-operations scripts have been removed from the active baseline, and application scaffolding has not started yet.

## Near-Term Priorities

- finalize repo cleanup from the prior repository state
- lock initial frontend and backend stack choices
- define data ingestion and normalization boundaries for the MVP jurisdictions
- document tariff data sources, agreement logic boundaries, and validation rules
- add test and CI foundations once the first services are in place
