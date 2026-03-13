---
id: 00_system__schemas_inbox_triage_md
title: Draft Placement Plan — Schema
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Draft Placement Plan — Schema

**Status:** Draft — binding once approved
**Stage:** 2.3 — Inbox Intelligence Layer
**Purpose:** Define the proposal artifact consumed by later automation.

---

## Draft Placement Plan Object

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `message_id` | string | Gmail message ID |
| `object_type` | string | Taxonomy object type |
| `lifecycle_state` | string | Lifecycle state |
| `system_domain` | string | System domain |
| `confidence` | number | 0.00 – 1.00 |
| `proposed_destination` | string | Repo root only |
| `status` | string | MUST equal `proposal_only` |
| `timestamp` | string | ISO-8601 |
| `model_version` | string | Classifier version |

---

## Invariants
- `status` MUST be `proposal_only`
- No execution instructions allowed
- No external system identifiers beyond `message_id`
- Schema violations invalidate the artifact

---

## Example

```json
{
  "message_id": "18c9f2e9d9a3b123",
  "object_type": "Legal Matter Email",
  "lifecycle_state": "Action Required",
  "system_domain": "Matters",
  "confidence": 0.91,
  "proposed_destination": "05_MATTERS",
  "status": "proposal_only",
  "timestamp": "2026-01-28T20:42:00Z",
  "model_version": "inbox-triage-v0.1"
}
```

---

## Valid Values

### object_type
- `Legal Matter Email`
- `Client Communication`
- `Vendor / Billing`
- `Marketing`
- `System Notification`
- `Noise`

### lifecycle_state
- `Action Required`
- `Waiting`
- `Reference`
- `Archive Candidate`

### system_domain
- `Matters`
- `Finance`
- `System Operations`
- `Research`
- `Personal Noise`

### proposed_destination
- `05_MATTERS`
- `07_FINANCE`
- `00_SYSTEM`
- `08_RESEARCH`
- `09_ARCHIVE`

---

## References

- Taxonomy: `02_PLAYBOOKS/INBOX_TRIAGE/TAXONOMY.md`
- Classifier Interface: `02_PLAYBOOKS/INBOX_TRIAGE/CLASSIFIER_INTERFACE.md`
