# PLANING WORKPLAN

Project ID: MHS-2D-MICRO-SAAS-001
Project Path: 04_INITIATIVES/HillSide_PORTFOLIO/MATTHEW_HOLDINGS_17513721_CANADA_INC/2D_MICRO_SAAS_BUILD_AND_SALE
Stage: Planning

## Decision Use
Use this file to sequence planning execution, assign owners, and track gate-readiness milestones.

## Planning Objective
Prepare implementation authorization for one specific product concept: TariffLookup.ca.

## Selected Product Concept

### Target Users
- Canadian businesses exporting to the United States that want to diversify destinations.
- Canadian businesses preparing for first-time export market entry.
- Typical user profiles: manufacturers, food producers, industrial suppliers, consumer product companies, and trade consultants supporting exporters.

### Core Problem
Exporters evaluating a new market often do not know the correct HS code at the start, yet still need to determine MFN tariffs, preferential tariffs, and agreement basis across multiple jurisdictions and data sources. That classification and tariff work is currently manual and time-consuming.

### Core Software Function
Given a crude product description or HS code and a destination country, return:
- probable HS code
- MFN tariff rate
- Preferential tariff rate (if applicable)
- Relevant trade agreement basis
- Eligibility notes or conditions

### MVP Feature Set
- Tariff lookup for one crude product description or one HS code and one destination at a time.
- Initial jurisdiction set: United States, European Union, United Kingdom, Japan, Brazil, China.
- Results display for probable HS code, MFN rate, preferential rate, agreement basis, and notes.

## Project Scope

### In Scope
- One product: TariffLookup.ca.
- Single primary workflow: product description or HS code + destination -> probable HS code + tariff and agreement output.
- Initial jurisdiction coverage limited to six jurisdictions.
- Core data model for tariff schedules, preferential schedules, agreement basis, and HS mappings.
- Frontend search-and-results interface with backend query and rule logic.
- Planning gate packet for implementation authorization.

### Out of Scope
- Multi-product roadmap execution.
- Multi-country simultaneous comparison in initial MVP.
- Non-tariff barrier summaries, landed cost estimation, duty-savings calculator, and opportunity recommendation engine.
- Enterprise custom workflows before first launch validation.
- Legal doctrine or portfolio-governance redesign.

### Scope Authority
Any scope expansion requires explicit ML1 approval before execution.

## Planning Workstreams

| Workstream | Scope | Primary Owner | Outputs |
| --- | --- | --- | --- |
| WS-01 User and Problem Lock | Freeze target user set and workflow problem for exporters | Matthew | `WORKPLAN.md`, `ASSUMPTIONS_CONSTRAINTS.md` |
| WS-02 Data and Rule Model Lock | Freeze jurisdiction list, tariff data requirements, and agreement-logic boundaries | Levine Law + Matthew | `SCOPE_DEFINITION.md`, `DEPENDENCIES.md` |
| WS-03 MVP Solution Design | Freeze MVP feature boundary and technical architecture assumptions | Levine Law + Matthew | `implementation/WORKPLAN.md`, `DEPENDENCIES.md` |
| WS-04 Validation and Launch Model | Freeze pilot validation path, communication cadence, and risk controls | Matthew Holdings | `COMMUNICATION_PLAN.md`, `RISK_REGISTER.md`, `OKR.md` |
| WS-05 Gate Packet Assembly | Finalize thresholds and gate recommendation package | Project Owner | `ML1_METRIC_APPROVAL.md`, `VALIDATION_REVIEW.md`, `../APPROVAL_RECORD.md` |

## Execution Sequence
1. Freeze target users and core exporter workflow problem.
2. Freeze tariff data coverage and agreement-rule boundaries.
3. Freeze MVP architecture and delivery constraints.
4. Freeze risk, communications, and validation measurement model.
5. Submit Planning -> Implementation gate packet for ML1 decision.

## Planning Milestones

| Milestone | Target Date | Status | Evidence |
| --- | --- | --- | --- |
| M1 - Product concept packet drafted | 2026-03-12 | finalized | Updated planning artifacts in `planning/` |
| M2 - User/problem lock complete | 2026-03-14 | finalized | `WORKPLAN.md`, `ASSUMPTIONS_CONSTRAINTS.md` |
| M3 - Data/rule and MVP scope freeze complete | 2026-03-16 | finalized | `SCOPE_DEFINITION.md`, `DEPENDENCIES.md` |
| M4 - Risk and communication model finalized | 2026-03-18 | finalized | `RISK_REGISTER.md`, `COMMUNICATION_PLAN.md` |
| M5 - Metric threshold packet submitted | 2026-03-19 | submitted | `ML1_METRIC_APPROVAL.md`, `OKR.md` |
| M6 - Planning -> Implementation gate decision | 2026-03-20 | pending approval | Updated `../APPROVAL_RECORD.md` |

## Immediate Planning Sprint (2026-03-12 to 2026-03-20)

| Item | Owner | Due Date | Evidence |
| --- | --- | --- | --- |
| Freeze target user set and workflow problem | Matthew | 2026-03-14 | `WORKPLAN.md`, `ASSUMPTIONS_CONSTRAINTS.md` |
| Freeze jurisdiction/data/rule model | Levine Law + Matthew | 2026-03-16 | `SCOPE_DEFINITION.md`, `DEPENDENCIES.md` |
| Freeze risk and communication controls | Matthew Holdings | 2026-03-18 | `RISK_REGISTER.md`, `COMMUNICATION_PLAN.md` |
| Submit metric threshold proposal | ML1 | 2026-03-19 | `ML1_METRIC_APPROVAL.md`, `OKR.md` |
| Assemble gate packet | Project Owner | 2026-03-20 | `VALIDATION_REVIEW.md`, `../APPROVAL_RECORD.md` |

## Resource Plan

### Human Roles

| Role | Responsibility |
| --- | --- |
| ML1 | Approval authority for thresholds, stage gates, and major trade-offs |
| Matthew | Product direction, prioritization, and execution decisions |
| Levine Law | Execution and launch governance support |
| Matthew Holdings | Ownership governance and portfolio-level oversight |

### Systems / Tools
- Product code repository
- Hosting/runtime environment
- Tariff and trade agreement data sources
- Analytics/event tracking
- Issue and incident tracking workspace

### Capacity Notes
- Project remains intentionally small until first launch outcome is achieved.
- Approved budget envelope for this planning packet is `CAD 500`.
- Implementation spend and tooling must stay inside approved envelope.
- Any expansion in jurisdictions or features requires explicit ML1 approval.

## Completion Condition
Planning is complete when implementation can start with frozen scope, approved thresholds, explicit risk controls, and ML1 gate authorization.
