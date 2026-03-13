---
id: 04_initiatives__system_portfolio__01_active_roadmaps__stage4__stage4_6_complex_incorporation_d4__scope_md
title: Stage 4.6 Scope — Complex Ontario Incorporation (D4)
owner: ML1
status: draft
created_date: 2026-02-11
last_updated: 2026-02-11
tags: [stage4, scope, d4, incorporation]
---

# Stage 4.6 — Complex Ontario Incorporation (D4)

## Purpose
Execute a structurally complex OBCA incorporation as a D4 deliverable with full controlled propagation, heightened QA, and audited approval.

## In Scope
- Custom share classes and rights
- Cross‑artifact dependencies (Articles, resolutions, cap table, USA if applicable)
- Multi‑system propagation (Drive, matter management, calendar reminder)
- Filing required (irreversible; corrective filing only)

## Out of Scope
- Any execution below D4 quality gate
- Any propagation without explicit approval artifacts
- Any deviation from structured write path

## Inputs & Dependencies
- `02_PLAYBOOKS/_assets/execution/rubrics/quality_rubric/README.md`
- `02_PLAYBOOKS/execution/supervised_execution_runbook/README.md`
- `02_PLAYBOOKS/_assets/execution/worksheets/ml1_approval_worksheet/README.md`
- `02_PLAYBOOKS/_assets/execution/schemas/action_proposal_schema/README.md`

## Workflow Summary
Classify D4 → Structured drafting → QA scoring → Approval artifact → Diff preview → Supervised execution → Verification → Log

## Quality Gate
Execution allowed only if **Total score ≥ 11/12** and **Correctness = 2**, **No Hallucinations = 2**, **Proper Scope & Authority = 2** (D4 target = 12/12).

## Entry Criteria
- Stage 4.4 complete
- D4 incorporation packet template defined
- Diff preview and rollback plan available

## Exit Criteria
- 1–2 complex incorporations executed
- No corrective filing required
- QA scoring consistent
- Approval path adhered to
- Audit clean

## Artifacts Produced
- Articles of Incorporation (custom share classes)
- Resolutions packet (directors + shareholders)
- Share issuance resolutions
- Share subscription agreements
- Cap table
- USA (if applicable)
- Corporate summary memo
- Filing instruction sheet
- Calendar annual return reminder
- Execution log and verification report

## Audit & Logging Requirements
- Log QA scores, approvals, diff previews, and confirmations
- Record filing receipt and irreversible‑filing note
- Audit review within 24 hours
- Maintain execution logs under `06_RUNS/`
