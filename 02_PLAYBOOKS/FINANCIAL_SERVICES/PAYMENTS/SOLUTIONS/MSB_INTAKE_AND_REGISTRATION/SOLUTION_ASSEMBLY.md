---
id: 02_playbooks__financial_services__payments__solutions__msb_intake_and_registration__solution_assembly_md
title: Solution Assembly: MSB_INTAKE_AND_REGISTRATION
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Solution Assembly: MSB_INTAKE_AND_REGISTRATION

## Inputs

Typical inputs may include:

- Description of the business model and services
- Customer and transaction flow summaries (high level)
- Jurisdictional footprint
- Ownership and control information
- Existing compliance documentation (if any)
- Prior advice or informal MSB classifications (if available)

## Core Assembly Components

- **Activity Characterization** — Mapping services to MSB categories
- **MSB Determination** — Assessment of registration applicability and scope
- **Registration Alignment** — Consistency review between activities and registration inputs
- **Policy Drafting** — Preparation of high-level AML/KYC policy documentation
- **Issue Identification** — Discrete identification of gaps, ambiguities, or follow-up items
- **Scope Boundary Documentation** — Clear articulation of what has and has not been assessed

## Modules and Overlays

| Component | Type | Invocation Condition |
|-----------|------|---------------------|
| AML_KYC_PROGRAM | Overlay | Policy drafting component references AML/KYC framework |
| RAILS | Overlay | If rail classification affects MSB categorization |
| CRYPTO | Overlay | If virtual currency dealing is part of client activities |

## Interfaces with Other Solutions

- May precede MSB_REVIEW
- May escalate into FINTRAC_RESPONSE if regulator contact is active
- Does not include or invoke ongoing AML/KYC implementation services
- Does not include contract drafting or provider agreement negotiation
