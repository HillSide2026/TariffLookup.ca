---
id: 02_playbooks__financial_services__payments__solutions__readme_md
title: Solutions — Payments
owner: ML1
status: draft
version: 1.0
supersedes:
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

## Playbook Header
Playbook ID: 02_playbooks__financial_services__payments__solutions__readme_md
Version: 1.0
Status: draft

Principles Referenced: PRN-001, PRN-002, PRN-003, PRN-004, PRN-005, PRN-006, PRN-009
Policies Applied: POL-001, POL-004, POL-006, POL-009, POL-011
Protocols Enforced: PRO-001, PRO-004, PRO-006, PRO-009, PRO-011
Doctrine Invoked: 00_SYSTEM/constitution.md, 01_DOCTRINE/index.yaml

Inputs: TBD
Outputs: TBD
Acceptance Criteria: TBD


# Solutions — Payments

Solution frames for Payments advisory problem spaces. Each solution is a 5-file packet encoding expert knowledge about a problem space.

---

## Contents

| File | Purpose |
|------|---------|
| [SOLUTION_INDEX.md](SOLUTION_INDEX.md) | Index of all registered solutions |
| [solution_packet_template/](solution_packet_template/) | Template files for creating new solutions |

---

## Solution Packet Structure

Each solution directory contains exactly 5 files:

| File | Purpose |
|------|---------|
| `README.md` | Purpose and interfaces |
| `SOLUTION_SCOPE.md` | In-scope / out-of-scope; terminal states |
| `SOLUTION_ASSEMBLY.md` | Modules and overlays this solution may invoke |
| `COMMON_ARTIFACTS.md` | Artifact categories |
| `RISK_PROFILE.md` | Non-substantive risk labels |

---

## Registered Solutions

| # | Solution | Folder |
|---|----------|--------|
| 1 | MSB_INTAKE_AND_REGISTRATION | [msb_intake_and_registration/](msb_intake_and_registration/) |
| 2 | MSB_REVIEW | [msb_review/](msb_review/) |
| 3 | FINTRAC_RESPONSE | [fintrac_response/](fintrac_response/) |
| 4 | RPAA_REGISTRATION | [rpaa_registration/](rpaa_registration/) |
| 5 | RPAA_THREE_YEAR_REVIEW | [rpaa_three_year_review/](rpaa_three_year_review/) |

---

## Overlays (Not Solutions)

Overlays are shared modules that solutions may invoke. They live in [overlays/](../overlays/), not here.

- AML_KYC_PROGRAM
- RAILS
- CRYPTO

---

## Provider Agreements

Provider agreement drafting/review lives in `02_PLAYBOOKS/substantive/contracts`. Not modeled as a solution here.
