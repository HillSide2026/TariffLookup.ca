---
id: 02_playbooks__execution__proposal_schema_v2_md
title: Proposal Record Schema — v2 (Stage 2.6)
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Proposal Record Schema — v2 (Stage 2.6)

## Purpose

Define a batch-friendly, persistent proposal record that supports:
- Queue-based review
- Grouping and filtering
- Long-term inspectability
- Decision audit trail

---

## Schema Definition

### Identification

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `proposal_id` | string | yes | Unique ID (format: `PROP-YYYYMMDD-NNN`) |
| `created_at` | ISO 8601 | yes | When proposal was generated |
| `batch_id` | string | no | Optional grouping for batch generation |

### Source

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `source_system` | enum | yes | `gmail` \| `manual` \| `inference` |
| `source_id` | string | yes | External ID (e.g., Gmail message ID) |
| `source_subject` | string | yes | Subject line or title |
| `source_sender` | string | yes | Sender email or origin |
| `source_timestamp` | ISO 8601 | yes | Original item timestamp |
| `source_labels` | string[] | no | Original labels/tags |

### Classification

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `object_type` | string | yes | From Taxonomy v1.3 |
| `system_domain` | string | yes | Matters \| Operations \| Firm Management \| etc. |
| `lifecycle_state` | enum | yes | `action_required` \| `reference` \| `waiting` |
| `confidence` | float | yes | 0.0 - 1.0 |
| `classifier_version` | string | yes | e.g., `inbox-triage-v0.2` |
| `reasoning_trace` | string[] | no | Why this classification |
| `ml1_override` | object | no | If ML1 corrected classification |

### Proposed Action

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `action_type` | enum | yes | `mark_processed` \| `apply_label` \| `create_stub` \| `add_note` |
| `action_target` | string | yes | Where action applies |
| `action_description` | string | yes | Plain language description |
| `reversibility` | object | yes | How to undo |

### Risk Assessment

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `external_write` | boolean | yes | Does this write to external system? |
| `user_facing_impact` | boolean | yes | Visible to LL clients? |
| `data_loss_risk` | boolean | yes | Could this lose data? |
| `scope_compliant` | boolean | yes | Within stage scope? |

### Status & Decision

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | enum | yes | `pending` \| `approved` \| `rejected` \| `deferred` \| `executed` |
| `decision_by` | string | no | Who made decision (ML1) |
| `decision_at` | ISO 8601 | no | When decision was made |
| `decision_notes` | string | no | Optional notes |
| `execution_result` | enum | no | `success` \| `failure` \| `rolled_back` |
| `execution_at` | ISO 8601 | no | When executed |

### Grouping (Batch Support)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `group_by_type` | string | yes | Object type for grouping |
| `group_by_domain` | string | yes | System domain for grouping |
| `group_by_sender` | string | no | Sender domain for grouping |
| `confidence_band` | enum | yes | `high` (≥0.85) \| `medium` (0.60-0.84) \| `low` (<0.60) |

---

## Example Record (JSON)

```json
{
  "proposal_id": "PROP-20260130-001",
  "created_at": "2026-01-30T04:00:00Z",
  "batch_id": null,

  "source_system": "gmail",
  "source_id": "19c0a035c2f062a4",
  "source_subject": "New message from Tejvir Boparai",
  "source_sender": "noreply@donotreply.soulpepper.com",
  "source_timestamp": "2026-01-29T13:48:38Z",
  "source_labels": ["IMPORTANT", "CATEGORY_UPDATES", "INBOX"],

  "object_type": "Operations — Inquiries",
  "system_domain": "Operations",
  "lifecycle_state": "action_required",
  "confidence": 0.80,
  "classifier_version": "inbox-triage-v0.2",
  "reasoning_trace": ["Sender is automated system", "Marked important/starred"],
  "ml1_override": {
    "original_type": "System Notification",
    "corrected_type": "Operations — Inquiries",
    "reason": "Sender is CRM system"
  },

  "action_type": "mark_processed",
  "action_target": "06_RUNS/EXECUTION/processed/",
  "action_description": "Create processing record in ML2",
  "reversibility": {
    "method": "delete_file",
    "target": "06_RUNS/EXECUTION/processed/19c0a035c2f062a4.md"
  },

  "external_write": false,
  "user_facing_impact": false,
  "data_loss_risk": false,
  "scope_compliant": true,

  "status": "executed",
  "decision_by": "ML1",
  "decision_at": "2026-01-30T04:15:00Z",
  "decision_notes": "Approved. Classifier calibration needed for soulpepper.com",
  "execution_result": "success",
  "execution_at": "2026-01-30T04:15:00Z",

  "group_by_type": "Operations — Inquiries",
  "group_by_domain": "Operations",
  "group_by_sender": "soulpepper.com",
  "confidence_band": "medium"
}
```

---

## Status Transitions

```
pending → approved → executed
pending → rejected
pending → deferred → pending (re-review)
approved → executed → rolled_back
```

---

## Validation Rules

1. All `required` fields must be present
2. `status` must follow valid transitions
3. `decision_*` fields required when status != `pending`
4. `execution_*` fields required when status == `executed`
5. `reversibility` must specify concrete undo method

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| v1 | 2026-01-30 | Initial schema (Stage 2.5) |
| v2 | 2026-01-30 | Added batch support, grouping fields, ML1 override |
