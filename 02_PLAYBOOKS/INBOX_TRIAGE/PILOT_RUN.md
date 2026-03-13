---
id: 02_playbooks__inbox_triage__pilot_run_md
title: Inbox Intelligence — Pilot Run Procedure
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Inbox Intelligence — Pilot Run Procedure

**Status:** Draft — for ML1 approval
**Stage:** 2.3 — Inbox Intelligence Layer
**Purpose:** Execute a bounded, non-destructive pilot of inbox classification.

This pilot produces:
- classification logs
- draft placement plans
- summary metrics

No execution, no Gmail writes, no automation.

---

## 1. Pilot Constraints (Hard Limits)

One pilot MUST define ALL of the following:

- Time window (e.g. last 7 days), OR
- Message cap (e.g. first 100 messages)
- Single classifier version
- Single run identifier

Example:

```
Pilot window: last 7 days
Max messages: 100
Run ID: pilot-2026-01-28
```

---

## 2. Inputs

- Gmail metadata via read-only integration
- Fields defined in CLASSIFIER_INTERFACE.md
- No attachments persisted
- No message mutation

---

## 3. Execution Steps

1. Enumerate messages within pilot bounds
2. For each message:
   - Extract permitted inputs
   - Run classifier
   - Emit Draft Placement Plan object
   - Append log entry (Phase 2.3.4)
3. Persist outputs only to approved directories

---

## 4. Outputs

### 4.1 Draft Placement Plans
Location:

```
06_RUNS/INBOX_TRIAGE/pilot/<RUN_ID>/placement_plans/
```

One JSON object per message.

### 4.2 Classification Log
Append to:

```
06_RUNS/INBOX_TRIAGE/logs/classification_log.ndjson
```

### 4.3 Pilot Summary Report
Location:

```
06_RUNS/INBOX_TRIAGE/pilot/<RUN_ID>/pilot_summary.md
```

Summary MUST include:
- total messages processed
- count by object type
- count by lifecycle state
- count by system domain
- confidence distribution
- Unknown / Needs Human rate

---

## 5. Validation Gates

### SMA-001 — Governance
- Confirms no-write-path intact
- Confirms no movement or execution
- Confirms outputs placed correctly

### SMA-005 — QA
- Validates schema compliance
- Validates log format
- Validates report completeness

Pilot is not "complete" until both pass.

---

## 6. Success Criteria

- ≥90% messages classified (not Unknown)
- No forbidden operations detected
- Logs are complete and append-only
- ML1 can review and understand outputs without additional tooling
