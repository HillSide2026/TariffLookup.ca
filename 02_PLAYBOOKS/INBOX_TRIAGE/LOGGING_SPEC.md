---
id: 02_playbooks__inbox_triage__logging_spec_md
title: Inbox Intelligence — Classification Logging Specification
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Inbox Intelligence — Classification Logging Specification

**Status:** Draft — for ML1 approval
**Stage:** 2.3 — Inbox Intelligence Layer
**Purpose:** Define a complete, auditable, append-only logging standard for inbox classification decisions.

Logging exists to:
- make classifier behavior inspectable,
- enable later review and correction,
- provide evidence for governance and QA,
- support future automation without reprocessing Gmail.

No logs may trigger execution or external writes.

---

## 1. Logging Principles

- Append-only
- Deterministic
- Non-destructive
- No secrets
- No Gmail mutation
- No human judgment embedded

Logs record **what the system believed**, not **what was done**.

---

## 2. Log Format

### 2.1 Format
- **NDJSON** (newline-delimited JSON)
- One line per classified message
- UTF-8 encoded

### 2.2 Canonical Location

```
06_RUNS/INBOX_TRIAGE/logs/classification_log.ndjson
```

Logs may be rotated by date, but never rewritten.

---

## 3. Required Fields (per entry)

| Field | Type | Description |
|-------|------|-------------|
| `timestamp` | string | ISO-8601 UTC |
| `message_id` | string | Gmail message ID |
| `object_type` | string | Taxonomy classification |
| `lifecycle_state` | string | Lifecycle classification |
| `system_domain` | string | System domain |
| `confidence` | number | 0.00–1.00 |
| `status` | string | MUST be `proposal_only` |
| `model_version` | string | Classifier or ruleset version |
| `inputs_summary` | object | Minimal, redacted evidence |
| `run_id` | string | Pilot or execution identifier |

---

## 4. Inputs Summary (Redaction Rules)

The log MUST NOT store full message bodies.

Allowed:
- subject (truncated, ≤120 chars)
- sender domain (not full address)
- label names
- received timestamp

Example:
```json
"inputs_summary": {
  "subject": "Re: Draft settlement timeline",
  "sender_domain": "clientco.com",
  "labels": ["INBOX", "IMPORTANT"],
  "received_at": "2026-01-27T14:12:03Z"
}
```

---

## 5. Example Log Entry

```json
{
  "timestamp": "2026-01-28T21:03:14Z",
  "message_id": "18c9f2e9d9a3b123",
  "object_type": "Legal Matter Email",
  "lifecycle_state": "Action Required",
  "system_domain": "Matters",
  "confidence": 0.91,
  "status": "proposal_only",
  "model_version": "inbox-triage-v0.1",
  "inputs_summary": {
    "subject": "Re: Draft settlement timeline",
    "sender_domain": "clientco.com",
    "labels": ["INBOX", "IMPORTANT"],
    "received_at": "2026-01-27T14:12:03Z"
  },
  "run_id": "pilot-2026-01-28"
}
```

---

## 6. Governance Constraints

- Logs are evidence, not authority
- Logs cannot be edited once written
- Logs do not imply correctness
- Logs do not authorize execution

**SMA-001 validates:**
- append-only behavior
- no forbidden fields
- status = proposal_only

**SMA-005 validates:**
- schema compliance
- required fields present
