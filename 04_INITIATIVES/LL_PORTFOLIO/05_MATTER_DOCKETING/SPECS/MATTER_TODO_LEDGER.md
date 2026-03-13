---
id: 04_initiatives__ll_portfolio__05_matter_docketing__specs__matter_todo_ledger_md
title: Matter To-Do Task Ledger Specification
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Matter To-Do Task Ledger Specification

**Status:** NORMATIVE
**Version:** 2.0
**Effective:** 2026-02-07

---

## 1. Purpose

The Task Ledger provides persistent, append-only memory for the Matter To-Do Report system. It prevents daily task regeneration from scratch by maintaining stable task identity and human-owned status across runs.

**Authority Level:** DERIVED / ADVISORY

The ledger is non-authoritative. It is not a docket. It adds memory and state to the task extraction pipeline without adding obligation enforcement.

---

## 2. Design Principle

> Extraction is ephemeral. The ledger is persistent. The report is a view, not the memory.

The ledger exists to prevent temporal amnesia. Tasks that were observed on Day 1 must not vanish on Day 5 solely because they fell outside the email input window.

---

## 3. Ledger Artifact

### 3.1 File

The ledger MUST be maintained as a local, append-only artifact named:

- `MATTER_TODO_LEDGER.md` or
- `MATTER_TODO_LEDGER.json`

Format selection is implementation-dependent. The ledger is the system of record for task continuity.

### 3.2 Ledger Entry Fields

Each ledger entry MUST include:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `task_id` | string | YES | Stable identifier (see Section 4) |
| `matter_id` | string | YES | Associated matter ID or `UNASSIGNED` |
| `task` | string | YES | Verb-first task text |
| `status` | enum | YES | One of: NEW, TRIAGED, WAITING, DONE, DROPPED, STALE |
| `first_seen` | date | YES | Date the task was first extracted |
| `last_seen` | date | YES | Date the task was most recently observed in extraction |
| `suggested_workstream` | enum | YES | One of: DELIVERY, FULFILLMENT, MARKETING, MANAGEMENT, UNROUTED |
| `suggested_lane` | enum | YES | One of: LAWYER, NON_LAWYER, ADMIN_ACCOUNTS, INTAKE, UNROUTED |
| `routing_confidence` | enum | YES | One of: HIGH, MEDIUM, LOW |
| `routing_reason` | string | YES | Short explanation anchored to evidence (quote-backed when possible) |
| `next_action_type` | enum | YES | One of: RESPOND, REVIEW, DRAFT, FILE_SUBMIT, SCHEDULE, PAY_INVOICE, SEND_REQUEST, UPDATE_LOG, OTHER |
| `evidence` | array | YES | Supporting evidence references (append-only) |

### 3.3 Append-Only Rule

Ledger entries MUST NOT be deleted automatically. Entries may only be removed by explicit human action.

---

## 4. Task Identity (Stable IDs)

### 4.1 Requirement

Each task MUST have a stable `task_id`. The same real-world task MUST always resolve to the same `task_id` regardless of which daily run observes it.

### 4.2 ID Generation

Default ID generation is a hash of:

```
hash(normalized_task_text + matter_id_or_UNASSIGNED + originating_message_ref)
```

If `message_ref` is unavailable, substitute:

```
hash(normalized_task_text + matter_id_or_UNASSIGNED + email_date + from + subject)
```

### 4.3 Normalization

Before hashing, task text MUST be normalized:

- Lowercased
- Whitespace collapsed
- Punctuation stripped

This ensures that minor formatting differences do not produce duplicate task IDs.

---

## 5. Ledger Status Model

### 5.1 Status Values

Ledger entries MUST use exactly one of the following statuses:

| Status | Meaning | Set By |
|--------|---------|--------|
| `NEW` | First observed, not yet reviewed | System (automatic on creation) |
| `TRIAGED` | Reviewed by a human, still pending | Human |
| `WAITING` | Blocked on external action | Human |
| `DONE` | Closed | Human |
| `DROPPED` | Explicitly marked "not a task" | Human |
| `STALE` | Unresolved and not re-seen past staleness threshold | System (automatic) |

### 5.2 Status Transition Rules

- The system MAY set status to `NEW` on task creation.
- The system MAY set status to `STALE` when the staleness threshold is exceeded.
- All other status transitions (`TRIAGED`, `WAITING`, `DONE`, `DROPPED`) are human-driven.
- The system MUST NOT auto-promote or auto-close tasks.

### 5.3 Staleness Threshold

A task becomes `STALE` when:

- Its status is `NEW` and `last_seen` exceeds the staleness threshold
- Default staleness threshold: 14 days since `last_seen`

Tasks with status `TRIAGED` or `WAITING` MUST NOT be automatically marked `STALE`.

---

## 6. Daily Run Behavior (Three-Phase)

Each daily run MUST perform all phases below in order.

### Phase 0 — Read Back Human Edits from Sheets

Before extraction, the system MUST read the most recent Sheets tab and merge any human edits into the local ledger. Human-editable fields are:

- `status` (ledger_status) — e.g., NEW → TRIAGED, DONE, DROPPED, WAITING
- `owner` — human-assigned owner
- `due` — human-assigned deadline

If a field in Sheets differs from the local ledger value, the Sheets value wins. This ensures that triage performed directly in the spreadsheet is not overwritten by the next pipeline run.

The system MUST NOT overwrite human-set values during reconciliation (Phase 2). Specifically:
- If `status` was changed by a human (e.g., to TRIAGED or DONE), the system MUST NOT reset it to NEW.
- If `owner` was set by a human, the system MUST NOT clear it.

### Phase 1 — Extract Candidates

1. Extract task candidates from today's inbound emails using the existing pipeline.
2. Apply all current classification, refusal, evidence, and attribution rules unchanged (per `MATTER_TODO_REPORT.md`).
3. Only emails classified as `ACTION_REQUIRED` may produce candidates.

Phase 1 is identical to the existing extraction pipeline. No changes.

### Phase 2 — Reconcile Against Ledger

For each extracted candidate:

**If it matches an existing ledger task:**
1. Reuse the existing `task_id`
2. Update `last_seen` to today's date
3. Append new evidence if materially different from existing evidence
4. Update routing fields (`suggested_workstream`, `suggested_lane`, `routing_confidence`, `routing_reason`, `next_action_type`) ONLY if new evidence materially changes routing; otherwise preserve prior routing to avoid churn

**If it does not match any existing task:**
1. Create a new ledger entry
2. Set `status` to `NEW`
3. Set `first_seen` and `last_seen` to today
4. Populate all routing fields (`suggested_workstream`, `suggested_lane`, `routing_confidence`, `routing_reason`, `next_action_type`)

**For ledger tasks not observed today:**
1. DO NOT delete them
2. Retain them in the ledger, including all routing fields
3. If `last_seen` exceeds the staleness threshold and status is `NEW`, set status to `STALE`

### 6.1 Match Criteria

A candidate matches an existing ledger task when their `task_id` values are identical (per the hash defined in Section 4).

---

## 7. Carry-Forward Rule

The daily Matter To-Do Report MUST include:

- All newly extracted tasks (status: `NEW`)
- All unresolved ledger tasks regardless of email window:
  - `NEW`
  - `TRIAGED`
  - `WAITING`
  - `STALE`

Tasks with status `DONE` or `DROPPED` MUST NOT appear in the report.

Tasks MUST NOT disappear from the report solely because they fall outside the email input window.

---

## 8. Sort Order

When the ledger is rendered (to report, spreadsheet, or any output view), entries MUST be sorted in the following order:

1. **Primary:** `suggested_workstream` — DELIVERY → FULFILLMENT → MARKETING → MANAGEMENT → UNROUTED
2. **Secondary:** `delivery_status` — ESSENTIAL → STRATEGIC → STANDARD → PARKED
3. **Tertiary:** `matter_id` — ascending alphanumeric (groups all tasks for the same matter together)
4. **Quaternary:** `task_id` — ascending within each matter

DELIVERY always appears first. Within each workstream, matters are ranked by delivery status so that essential matters surface before parked matters.

Each Sheets tab MUST be timestamped (e.g., `2026-02-09_1539`), not date-only.

---

## 9. Non-Goals

The ledger MUST NOT:

- Be treated as a docket
- Invent deadlines or owners
- Auto-resolve tasks
- Delete tasks automatically
- Infer completion from silence
- Create or infer personal accountability
- Auto-assign internal staff
- Treat routing as authoritative staffing policy

---

## 10. References

- `MATTER_TODO_REPORT.md` — Report specification (references this document for carry-forward behavior)
- `MATTER_TODO_OUTPUT_SCHEMA.md` — Output schema (includes ledger presentation fields)
- `MATTER_TODO_CONFIDENCE_MODEL.md` — Confidence scoring (unchanged)
