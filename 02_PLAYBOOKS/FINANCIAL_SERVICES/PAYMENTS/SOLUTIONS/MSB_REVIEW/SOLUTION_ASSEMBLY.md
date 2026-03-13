---
id: 02_playbooks__financial_services__payments__solutions__msb_review__solution_assembly_md
title: Solution Assembly: MSB_REVIEW
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Solution Assembly: MSB_REVIEW

## Inputs

Typical inputs for an MSB Review may include:

- Existing FINTRAC MSB registration details
- Description of current business model and services
- Prior compliance documentation (if available)
- Organizational and ownership information
- High-level transaction or customer flow descriptions
- Information regarding recent or planned business changes

## Analytical Components

The solution is assembled from the following components:

- **Activity Mapping** — Mapping of current services to MSB categories
- **Registration Consistency Review** — Alignment between activities and registered information
- **Change Detection** — Identification of unreflected or material changes
- **Framework Adequacy Review** — Structural review of AML/KYC program elements
- **Issue Mapping** — Translation of findings into discrete legal issues

## Workstream Assembly

Workstreams are optional and engagement-specific. Each workstream draws on the analytical components above and may produce distinct artifacts.

### A. STR / LVTR Advisory

- Draws on: Framework Adequacy Review, Issue Mapping
- Scope: Interpretive advice, issue identification, escalation signaling
- Excludes: Filing, submission, operational execution, transaction testing

### B. Quarterly Internal Effectiveness Review

- Draws on: All analytical components
- Cadence: Quarterly
- Focus: Design and structural effectiveness, internal consistency
- Outputs: Advisory and comparative across periods

### C. Internal Annual Health Check

- Draws on: All analytical components + prior quarterly outputs
- Cadence: Annual
- Focus: Accumulated risk signals, structural drift, overall posture
- Distinct from quarterly reviews in scope and depth

## Modules and Overlays

| Component | Type | Invocation Condition |
|-----------|------|---------------------|
| AML_KYC_PROGRAM | Overlay | Framework adequacy review references AML/KYC materials |
| RAILS | Overlay | If rail classification affects activity characterization |
| CRYPTO | Overlay | If virtual currency dealing is part of current activities |

## Interfaces with Other Solutions

- May follow MSB_INTAKE_AND_REGISTRATION
- May precede MSB_INTAKE_AND_REGISTRATION (if re-registration or amendment is required)
- May escalate into FINTRAC_RESPONSE if regulator engagement is active or imminent
- May reference AML/KYC program materials without redesigning them

## Cross-Solution Invariant

No automatic escalation from MSB_REVIEW to FINTRAC_RESPONSE. All transitions require explicit human authorization.
