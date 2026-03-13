---
id: 02_playbooks__execution__supervised_execution_runbook_md
title: Supervised Execution Runbook
owner: ML1
status: draft
version: 1.0
supersedes:
created_date: 2026-02-08
last_updated: 2026-02-11
tags: []
---

## Playbook Header
Playbook ID: 02_playbooks__execution__supervised_execution_runbook_md
Version: 1.0
Status: draft

Principles Referenced: PRN-001, PRN-002, PRN-003, PRN-004, PRN-005, PRN-006, PRN-009
Policies Applied: POL-002, POL-003, POL-004, POL-006, POL-009
Protocols Enforced: PRO-002, PRO-003, PRO-004, PRO-006, PRO-009
Doctrine Invoked: 00_SYSTEM/constitution.md, 01_DOCTRINE/index.yaml

Inputs: TBD
Outputs: TBD
Acceptance Criteria: TBD


# Supervised Execution Runbook

## Purpose

Define the minimal, safe procedure for executing a single approved action.

---

## Preconditions

- Approved Action Proposal exists
- ML1 Approval Worksheet completed with "Approve"
- SMA-001 governance check passed

---

## Stage 4 Execution Gate Rule

No artifact may proceed to execution unless:

- QA Scoring Sheet completed
- Total score ≥ 11/12
- Correctness = 2
- No Hallucinations = 2
- Proper Scope & Authority = 2
- Evidence references attached
- ML1 approval artifact completed

If any requirement is not met:

Execution is automatically blocked.

All QA fails must be logged in `02_PLAYBOOKS/_assets/execution/log_formats/calibration_log/README.md`.

No exceptions.

---

## Execution Steps

1. Load approved Action Proposal
2. Verify approval status = Approved
3. Re-validate scope:
   - Single action
   - Reversible
   - No unauthorized external writes
4. Execute action exactly as described
5. Capture execution result
6. Write execution log entry
7. Halt — no additional actions permitted

---

## Failure Handling

If any step fails:

- Abort immediately
- Do not retry automatically
- Record failure in execution log
- Escalate to ML1

---

## Postconditions

- Action completed or safely aborted
- System state unchanged beyond approved action
- Full audit trail preserved
