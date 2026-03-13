---
id: 04_initiatives__system_portfolio__01_active_roadmaps__stage4__stage4_4__scope_md
title: Stage 4.4 Scope — D4 Execution (Controlled Propagation)
owner: ML1
status: draft
created_date: 2026-02-11
last_updated: 2026-02-11
tags: [stage4, scope, d4]
---

# Stage 4.4 — D4 Execution (Controlled Propagation)

## Purpose
Enable complex outputs with controlled propagation under the strictest QA and approval controls.

## In Scope
- D4 outputs with multi‑system impact
- Pre‑execution diff preview
- Rollback plan and post‑execution verification
- Audit review within 24 hours

## Out of Scope
- Any execution below the D4 quality gate
- Any propagation without explicit approval artifacts

## Inputs & Dependencies
- `02_PLAYBOOKS/_assets/execution/rubrics/quality_rubric/README.md`
- `02_PLAYBOOKS/execution/supervised_execution_runbook/README.md`
- `02_PLAYBOOKS/_assets/execution/worksheets/ml1_approval_worksheet/README.md`
- `02_PLAYBOOKS/_assets/execution/schemas/action_proposal_schema/README.md`

## Workflow Summary
Classify D4 → Build artifacts → QA scoring → Approval artifact → Diff preview → Supervised execution → Verification → Log

## Quality Gate
Execution allowed only if **Total score ≥ 11/12** and **Correctness = 2**, **No Hallucinations = 2**, **Proper Scope & Authority = 2** (D4 target = 12/12).

## Entry Criteria
- Stage 4.3 complete
- D4 workflows defined
- Diff preview and rollback mechanisms available

## Exit Criteria
- 3 successful D4 executions
- No audit defects
- Rollback tested
- No authority drift detected

## Artifacts Produced
- D4 execution packet
- Diff preview
- Rollback plan
- Post‑execution verification report

## Audit & Logging Requirements
- Log QA scores, approvals, diff previews, and confirmations
- Audit review within 24 hours
- Maintain execution logs under `06_RUNS/`
