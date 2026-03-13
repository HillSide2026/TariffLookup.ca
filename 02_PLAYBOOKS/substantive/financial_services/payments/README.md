---
id: 02_playbooks__financial_services__payments__readme_md
title: Financial Services — Payments
owner: ML1
status: draft
version: 1.0
supersedes:
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

## Playbook Header
Playbook ID: 02_playbooks__financial_services__payments__readme_md
Version: 1.0
Status: draft

Principles Referenced: PRN-001, PRN-002, PRN-003, PRN-004, PRN-006, PRN-009
Policies Applied: POL-004, POL-006, POL-009, POL-011
Protocols Enforced: PRO-004, PRO-006, PRO-009, PRO-011
Doctrine Invoked: 00_SYSTEM/constitution.md, 01_DOCTRINE/index.yaml

Inputs: TBD
Outputs: TBD
Acceptance Criteria: TBD


# Financial Services — Payments

Architecture for payments advisory matters. This module defines solution frames, overlays, decision support, and agent infrastructure for the Payments practice area. It contains no legal or compliance analysis and no substantive requirements, thresholds, or procedures.

---

## Primary Solutions

| # | Solution | Folder |
|---|----------|--------|
| 1 | MSB_INTAKE_AND_REGISTRATION | [solutions/msb_intake_and_registration/](solutions/msb_intake_and_registration/) |
| 2 | MSB_REVIEW | [solutions/msb_review/](solutions/msb_review/) |
| 3 | FINTRAC_RESPONSE | [solutions/fintrac_response/](solutions/fintrac_response/) |
| 4 | RPAA_REGISTRATION | [solutions/rpaa_registration/](solutions/rpaa_registration/) |
| 5 | RPAA_THREE_YEAR_REVIEW | [solutions/rpaa_three_year_review/](solutions/rpaa_three_year_review/) |

---

## Overlays

Overlays are shared modules invoked by solutions. They are not solutions themselves.

| Overlay | Folder |
|---------|--------|
| AML/KYC Program | [overlays/aml_kyc_program/](overlays/aml_kyc_program/) |
| Rails | [overlays/rails/](overlays/rails/) |
| Crypto | [overlays/crypto/](overlays/crypto/) |

---

## Provider Agreements

Drafting and review of provider agreements lives in `02_PLAYBOOKS/substantive/contracts` (not here). This practice area may reference provider agreement terms but does not produce or review them.

---

## Structure

| Directory / File | Purpose |
|------------------|---------|
| [solutions/](solutions/) | Solution frames (5 solutions, 5-file packet each) |
| [overlays/](overlays/) | Shared overlay modules (AML/KYC, Rails, Crypto) |
| [agents/](agents/) | Agent catalog, permissions, handoffs |
| [decision_lenses/](decision_lenses/) | Analytical frameworks |
| [failure_modes/](failure_modes/) | Known failure patterns |
| [issue_maps/](issue_maps/) | Structured issue taxonomies |
| [question_banks/](question_banks/) | Intake and scoping questions |
| [regulatory_surfaces/](regulatory_surfaces/) | Statutory/regulatory touchpoints |
| [DECISION_REGISTRY.md](DECISION_REGISTRY.md) | Named decision points |
| [INTAKE_QUESTION_PACKS.md](INTAKE_QUESTION_PACKS.md) | Minimum viable fact sets per solution |
| [KNOWN_SAFE_DEFAULTS.md](KNOWN_SAFE_DEFAULTS.md) | Rebuttable default positions |
| [SOLUTION_COLLISION_MATRIX.md](SOLUTION_COLLISION_MATRIX.md) | Multi-solution routing |

---

## Operating Posture

Containment over completeness; explicit exit states; no assumed ongoing representation.
