---
id: 02_playbooks__execution__supervised_execution_runbook_md
title: Supervised Execution Runbook — Stage 2.5
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Supervised Execution Runbook — Stage 2.5

## Purpose

Define the minimal, safe procedure for executing a single approved action.

---

## Preconditions

- Approved Action Proposal exists
- ML1 Approval Worksheet completed with "Approve"
- SMA-001 governance check passed

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
