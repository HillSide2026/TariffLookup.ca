---
id: 04_initiatives__system_portfolio__01_active_roadmaps__stage3__stage3_8__stage3_8_execution_governance_doc_md
title: "Stage 3.8 — SB Execution Governance & Lifecycle Control"
owner: ML1
status: active
created_date: 2026-02-12
last_updated: 2026-02-12
tags: [stage3, governance, lifecycle, authority, execution]
---

# SB Execution Governance & Lifecycle Control

## 1. Purpose

This document formalizes the authority model, lifecycle constraints, and execution boundaries governing document generation and promotion within the SB Execution enclave.

It defines what is permitted, who may act, and under what conditions actions are valid.

This document does not define automation logic — it defines authority and lifecycle doctrine.

---

## 2. Authority Model

### ML1 — Sole Authority

ML1 retains exclusive authority to:

- Approve DRAFT → FINAL promotion
- Define lifecycle transitions
- Modify metadata contract
- Approve schema evolution
- Override execution state

ML1 may:

- Trigger generation
- Trigger promotion
- Reject promotion
- Halt execution pipeline

### ML2 — Execution Agent

ML2 may:

- Generate DRAFT documents
- Execute promotion only upon explicit ML1 trigger
- Set metadata only within defined schema contract
- Write run logs

ML2 may NOT:

- Promote without ML1 trigger
- Modify FINAL documents
- Alter authority model
- Introduce new metadata keys
- Change lifecycle state outside allowed transitions

---

## 3. Lifecycle States

### Allowed States

| State | Meaning |
|-------|---------|
| DRAFT | Generated, mutable, not approved |
| FINAL | Approved by ML1, immutable |
| REJECTED | Explicitly rejected by ML1 |

---

## 4. Lifecycle Transitions

### Allowed

- DRAFT → FINAL (ML1 only)
- DRAFT → REJECTED (ML1 only)

### Forbidden

- FINAL → DRAFT
- FINAL → REJECTED
- REJECTED → FINAL

FINAL is append-only. No mutation permitted.

---

## 5. Write Constraints

- DRAFTS are write-once (unique filename enforcement).
- FINAL is append-only (no overwrite).
- `overwrite` must always be `false`.
- Duplicate filename → execution failure.
- Promotion without run log → execution failure.

---

## 6. Logging Doctrine

Every execution must produce a durable run log in RUN_LOGS.

If:

- Draft upload succeeds but metadata fails → execution fails.
- Promotion succeeds but run log fails → promotion fails.

Audit log is mandatory for lifecycle mutation.

---

## 7. Execution Boundary

All write operations must occur inside:

```
SB Execution/
```

No cross-library writes permitted.

Bridge must reject any request targeting folders outside enclave.

---

## 8. Drift Control

Bridge must fail if:

- Required folders are missing
- Required columns are missing
- Drive ID mismatches
- Authority mismatches
- Duplicate RunID detected

Discovery scanner remains source of truth for drift detection.

---

## 9. Non-Goals

This document does not:

- Define enforcement engine
- Define remediation automation
- Define permission hardening
- Define metric scoring logic

Stage 3.8 governance is complete when all execution paths conform to this document.
