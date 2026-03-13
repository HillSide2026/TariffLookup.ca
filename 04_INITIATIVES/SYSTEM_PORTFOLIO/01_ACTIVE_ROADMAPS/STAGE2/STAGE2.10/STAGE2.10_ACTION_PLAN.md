---
id: 04_initiatives__system_portfolio__01_active_roadmaps__stage2__stage2_10__stage2_10_action_plan_md
title: Stage 2.10 — Move Authoritative Ledger to Google Drive (Backlog)
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-10
tags: []
---

# Stage 2.10 — Move Authoritative Ledger to Google Drive (Backlog)

## Status

- **Status:** ✅ COMPLETE
- **Owner:** ML1
- **Effective Start:** 2026-02-10
- **Closed:** 2026-02-10
- **Authority Gate:** ML1-approved ledger schema + change control approach

---

## Stage 2.10 Core Question

> Can the Matter To-Do Ledger become a Drive-hosted, human-editable system-of-record (Google Sheet) while preserving stable task identity and carry-forward continuity?

**Stage 2.10 succeeds if the Drive ledger is the persistence layer, human status edits are respected, and daily reports reconcile against the ledger (ledger-first).**

---

## 1. Scope Definition

### In-Scope

| Activity | Purpose |
|----------|---------|
| Create canonical ledger doc (Google Sheet) | Human-editable source of truth |
| Define strict machine-readable table schema | Deterministic reconciliation |
| Implement reconciliation read/write (Drive ledger-first) | Persistence + continuity |
| Migration plan (local → Drive) preserving `task_id` | No identity resets |
| Change control / snapshots | Auditability + rollback |

### Out-of-Scope

| Element | Why Excluded |
|---------|--------------|
| Rewriting task extraction rules beyond persistence needs | Keep changes minimal |
| Turning ledger into docket / obligation system | Remains advisory |
| Automatic “DONE” inference | Human-owned status only |

---

## 2. Ledger Requirements (Normative)

1. Drive ledger MUST be the system-of-record for task state.
2. `task_id` MUST be stable and preserved through migration.
3. Human edits to `status` MUST NOT be overwritten by automation.
4. Daily report MUST start from ledger unresolved tasks, then augment from new email extraction.
5. Tasks MUST NOT disappear when they fall out of the email window.

---

## 3. Deliverables

- Canonical Google Sheet created in approved Drive folder
- Ledger schema documented:
  - columns
  - enum values
  - which fields are human-editable vs system-managed
- Reconciliation logic implemented and tested
- Migration runbook executed (or ready)
- Snapshot/versioning strategy implemented (Drive versions or daily export)

---

## 4. Acceptance Criteria (Shared for Stages 2.9–2.10)

- Ledger persists in Drive and survives daily regeneration
- Lawyer 1 can mark `DONE` / `TRIAGED` / `WAITING` / `DROPPED` directly in Drive
- Daily report uses Drive ledger as the starting point (email extraction only augments)
- No task disappears due to email window expiration

---

## 5. Execution Tracking (Backlog)

### Phase 1: Sheet + Schema (Complete)
| Item | Status | Notes |
|------|--------|-------|
| Create canonical Google Sheet | ✅ | Approved folder |
| Define schema (columns + enums) | ✅ | ML1-approved |
| Define human-editable fields | ✅ | Status + notes only |

### Phase 2: Reconciliation (Complete)
| Item | Status | Notes |
|------|--------|-------|
| Read ledger from Drive | ✅ | Ledger-first |
| Write updates to Drive ledger | ✅ | Preserve human status |
| Carry-forward unresolved tasks | ✅ | No window-drop |

### Phase 3: Migration + Change Control (Complete)
| Item | Status | Notes |
|------|--------|-------|
| Export local ledger | ✅ | Preserved `task_id` |
| Import into Drive ledger | ✅ | Counts + IDs verified |
| Snapshot strategy | ✅ | Drive versions or daily export |
