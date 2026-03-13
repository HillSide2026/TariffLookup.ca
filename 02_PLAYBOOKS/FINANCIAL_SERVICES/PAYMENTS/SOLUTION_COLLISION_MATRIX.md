---
id: 02_playbooks__financial_services__payments__solution_collision_matrix_md
title: Solution Collision Matrix — Payments
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Solution Collision Matrix — Payments

Routing logic when multiple solutions or overlays interact.

---

## Named Collision Scenarios

| Scenario | Solutions Involved | Routing Owner | Notes |
|----------|--------------------|---------------|-------|
| Intake termination | MSB_INTAKE_AND_REGISTRATION may terminate if MSB registration is not required | _Placeholder_ | Intake may conclude that no further solution is needed |
| FINTRAC pre-emption | FINTRAC_RESPONSE may pre-empt other active solutions | _Placeholder_ | Active FINTRAC inquiry takes priority over ongoing advisory work |
| Intake to review | MSB_INTAKE_AND_REGISTRATION may precede or follow MSB_REVIEW | _Placeholder_ | _Placeholder_ |
| Registration sequencing | MSB_INTAKE_AND_REGISTRATION and RPAA_REGISTRATION may run in parallel or sequence | _Placeholder_ | _Placeholder_ |
| Review overlap | MSB_REVIEW and RPAA_THREE_YEAR_REVIEW may coincide | _Placeholder_ | _Placeholder_ |
| Overlay invocation | Any solution may invoke AML_KYC_PROGRAM, RAILS, or CRYPTO overlays | _Placeholder_ | Overlays are shared modules, not solutions |

---

## Collision Rules

_Placeholder — define routing rules per scenario._

---

## Cross-Practice-Area Collisions

| Collision | Routing |
|-----------|---------|
| PAYMENTS x CONTRACTS | Provider agreement drafting/review lives in CONTRACTS; Payments provides regulatory context |
| PAYMENTS x CORPORATE | _Placeholder_ |
