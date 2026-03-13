---
id: 02_playbooks__financial_services__payments__solutions__msb_intake_and_registration__solution_assembly_md
title: Solution Assembly: MSB_INTAKE_AND_REGISTRATION
owner: ML1
status: draft
version: 1.0
supersedes:
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

## Playbook Header
Playbook ID: 02_playbooks__financial_services__payments__solutions__msb_intake_and_registration__solution_assembly_md
Version: 1.0
Status: draft

Principles Referenced: PRN-001, PRN-002, PRN-003, PRN-004, PRN-005, PRN-006, PRN-008, PRN-009
Policies Applied: POL-003, POL-004, POL-005, POL-006, POL-007, POL-009
Protocols Enforced: PRO-003, PRO-004, PRO-005, PRO-006, PRO-007, PRO-009
Doctrine Invoked: 00_SYSTEM/constitution.md, 01_DOCTRINE/index.yaml

Inputs: TBD
Outputs: TBD
Acceptance Criteria: TBD


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
