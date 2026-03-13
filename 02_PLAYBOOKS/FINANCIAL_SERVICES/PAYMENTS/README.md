---
id: 02_playbooks__financial_services__payments__readme_md
title: Financial Services — Payments
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-25
tags: []
---

# Financial Services — Payments

Architecture for payments advisory matters. This module defines solution frames, overlays, decision support, and agent infrastructure for the Payments practice area. It contains no legal or compliance analysis and no substantive requirements, thresholds, or procedures.

---

## Strategies

High-value engagement architectures that may orchestrate multiple solutions. Strategies require ML1 approval to create and live under `STRATEGIES/`.

---

## Primary Solutions

| # | Solution | Folder |
|---|----------|--------|
| 1 | MSB_INTAKE_AND_REGISTRATION | [SOLUTIONS/MSB_INTAKE_AND_REGISTRATION/](SOLUTIONS/MSB_INTAKE_AND_REGISTRATION/) |
| 2 | MSB_REVIEW | [SOLUTIONS/MSB_REVIEW/](SOLUTIONS/MSB_REVIEW/) |
| 3 | FINTRAC_RESPONSE | [SOLUTIONS/FINTRAC_RESPONSE/](SOLUTIONS/FINTRAC_RESPONSE/) |
| 4 | RPAA_REGISTRATION | [SOLUTIONS/RPAA_REGISTRATION/](SOLUTIONS/RPAA_REGISTRATION/) |
| 5 | RPAA_THREE_YEAR_REVIEW | [SOLUTIONS/RPAA_THREE_YEAR_REVIEW/](SOLUTIONS/RPAA_THREE_YEAR_REVIEW/) |

---

## Overlays

Overlays are shared modules invoked by solutions. They are not solutions themselves.

| Overlay | Folder |
|---------|--------|
| AML/KYC Program | [OVERLAYS/AML_KYC_PROGRAM/](OVERLAYS/AML_KYC_PROGRAM/) |
| Rails | [OVERLAYS/RAILS/](OVERLAYS/RAILS/) |
| Crypto | [OVERLAYS/CRYPTO/](OVERLAYS/CRYPTO/) |

---

## Provider Agreements

Drafting and review of provider agreements lives in FINANCIAL_SERVICES/CONTRACTS (not here). This practice area may reference provider agreement terms but does not produce or review them.

---

## Structure

| Directory / File | Purpose |
|------------------|---------|
| [STRATEGIES/](STRATEGIES/) | High-value engagement architectures |
| [SOLUTIONS/](SOLUTIONS/) | Solution frames (5 solutions, 5-file packet each) |
| [OVERLAYS/](OVERLAYS/) | Shared overlay modules (AML/KYC, Rails, Crypto) |
| [AGENTS/](AGENTS/) | Agent catalog, permissions, handoffs |
| [DECISION_LENSES/](DECISION_LENSES/) | Analytical frameworks |
| [FAILURE_MODES/](FAILURE_MODES/) | Known failure patterns |
| [ISSUE_MAPS/](ISSUE_MAPS/) | Structured issue taxonomies |
| [QUESTION_BANKS/](QUESTION_BANKS/) | Intake and scoping questions |
| [REGULATORY_SURFACES/](REGULATORY_SURFACES/) | Statutory/regulatory touchpoints |
| [DECISION_REGISTRY.md](DECISION_REGISTRY.md) | Named decision points |
| [INTAKE_QUESTION_PACKS.md](INTAKE_QUESTION_PACKS.md) | Minimum viable fact sets per solution |
| [KNOWN_SAFE_DEFAULTS.md](KNOWN_SAFE_DEFAULTS.md) | Rebuttable default positions |
| [SOLUTION_COLLISION_MATRIX.md](SOLUTION_COLLISION_MATRIX.md) | Multi-solution routing |

---

## Operating Posture

Containment over completeness; explicit exit states; no assumed ongoing representation.
