---
id: 02_playbooks__financial_services__payments__solutions__readme_md
title: Solutions — Payments
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Solutions — Payments

Solution frames for Payments advisory problem spaces. Each solution is a 5-file packet encoding expert knowledge about a problem space.

---

## Contents

| File | Purpose |
|------|---------|
| [SOLUTION_INDEX.md](SOLUTION_INDEX.md) | Index of all registered solutions |
| [SOLUTION_PACKET_TEMPLATE/](SOLUTION_PACKET_TEMPLATE/) | Template files for creating new solutions |

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
| 1 | MSB_INTAKE_AND_REGISTRATION | [MSB_INTAKE_AND_REGISTRATION/](MSB_INTAKE_AND_REGISTRATION/) |
| 2 | MSB_REVIEW | [MSB_REVIEW/](MSB_REVIEW/) |
| 3 | FINTRAC_RESPONSE | [FINTRAC_RESPONSE/](FINTRAC_RESPONSE/) |
| 4 | RPAA_REGISTRATION | [RPAA_REGISTRATION/](RPAA_REGISTRATION/) |
| 5 | RPAA_THREE_YEAR_REVIEW | [RPAA_THREE_YEAR_REVIEW/](RPAA_THREE_YEAR_REVIEW/) |

---

## Overlays (Not Solutions)

Overlays are shared modules that solutions may invoke. They live in [OVERLAYS/](../OVERLAYS/), not here.

- AML_KYC_PROGRAM
- RAILS
- CRYPTO

---

## Provider Agreements

Provider agreement drafting/review lives in FINANCIAL_SERVICES/CONTRACTS. Not modeled as a solution here.
