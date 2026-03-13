# Scope Definition

Project ID: MHS-2D-MICRO-SAAS-001
Project Path: 04_INITIATIVES/HillSide_PORTFOLIO/MATTHEW_HOLDINGS_17513721_CANADA_INC/2D_MICRO_SAAS_BUILD_AND_SALE
Stage: Planning

## Decision Use
Use this file for supplemental scope rationale; canonical project scope is maintained in `WORKPLAN.md`.

## Selected Product Concept
TariffLookup.ca for Canadian exporters evaluating new destination markets.

## In Scope
- Target users: Canadian exporters and trade consultants supporting export-market evaluation.
- User inputs: one crude product description or one HS code, plus one destination country per query.
- User outputs: probable HS code, MFN tariff, preferential tariff (if applicable), agreement basis, and eligibility notes.
- Initial jurisdictions: United States, European Union, United Kingdom, Japan, Brazil, China.
- Minimum dataset elements per jurisdiction:
  - tariff schedule by HS code
  - preferential tariff schedules under applicable trade agreements
  - agreement eligibility rules needed for output notes
- Basic architecture boundary:
  - frontend for input and results display
  - backend for tariff query and agreement logic
  - database for tariff schedules, jurisdiction metadata, and HS mappings

## Out of Scope
- Multi-country comparison output in one request for the initial MVP.
- Non-tariff barrier summaries.
- Landed cost estimation and duty-savings calculator.
- Export opportunity recommendation engine.
- Enterprise custom data pipelines before initial launch validation.

## Illustrative Query (MVP)
- Input:
  - Product description: `stainless steel kitchen knife blades`
  - Destination: `Japan`
- Output format:
  - Probable HS code
  - MFN tariff rate
  - Preferential tariff rate (if applicable)
  - Agreement basis (if applicable)
  - Eligibility notes

## Implementation Readiness Deliverables
- `WORKPLAN.md`
- `ASSUMPTIONS_CONSTRAINTS.md`
- `DEPENDENCIES.md`
- `RISK_REGISTER.md`
- `COMMUNICATION_PLAN.md`
- `OKR.md`
- `VALIDATION_REVIEW.md`
- `ML1_METRIC_APPROVAL.md`

## Gate Criteria for Implementation Authorization
- Target users, core workflow, and MVP boundaries are explicit and frozen.
- Jurisdiction list and data/rule requirements are explicit and feasible.
- Risks to data correctness, schedule, and budget have active mitigations.
- KPI package is reproducible and thresholded for ML1 decision.
