---
id: 00_system__schemas_md
title: Artifact Schemas
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-24
tags: []
---

# Artifact Schemas

All markdown files in this repository MUST begin with YAML frontmatter.

## Required Fields (All Artifacts)

---
id:
title:
owner: ML1
status: draft | proposed | approved | deprecated
created_date:
last_updated:
tags: []
---

## Additional Fields (Doctrine)

---
effective_date:
supersedes:
provenance:
  decided_by: ML1
  decided_on:
  context:
---

## Matter

Matter = {
  overview,
  facts,
  Records (documents + communications including email)
  analysis,
  Outputs
  actions,
}

---

## MATTER.yaml Schema (05_MATTERS)

Location: `05_MATTERS/{delivery_status}/{matter_id}/MATTER.yaml`

### Required Fields

```yaml
matter_id: string        # Required. Clio matter ID (e.g., "25-927-00003")
matter_name: string      # Required. Matter/client name
status: enum             # Required. Clio matter status
delivery_status: enum    # Required. Lawyer attention priority
fulfillment_status: enum # Required. Admin workload state
created_date: date       # Required. Date matter was created
```

### Field Enums

| Field | Allowed Values |
|-------|----------------|
| `status` | `Open` \| `Pending` \| `Closed` |
| `delivery_status` | `Essential` \| `Strategic` \| `Standard` \| `Parked` |
| `fulfillment_status` | `urgent` \| `active` \| `keep in view` \| `dormant` |

### Non-Inference Rule

These three fields are independent. Do not infer any field from any other:
- `status` (Clio) does not imply `delivery_status` or `fulfillment_status`
- `delivery_status` (ML1) does not imply `status` or `fulfillment_status`
- `fulfillment_status` (Admin) does not imply `status` or `delivery_status`

### Example

```yaml
matter_id: "25-927-00003"
matter_name: "Stream Ventures Limited"
status: "Open"
delivery_status: "Essential"
fulfillment_status: "urgent"
created_date: "2025-09-27"
```

### Directory Mapping

Matters are placed in directories by `delivery_status` only:
- `Essential` → `05_MATTERS/ESSENTIAL/`
- `Strategic` → `05_MATTERS/STRATEGIC/`
- `Standard` → `05_MATTERS/STANDARD/`
- `Parked` → `05_MATTERS/PARKED/`
---

## Matter Stages Schema

Location: `00_SYSTEM/schemas/SCHEMAS_MATTER_STAGES.md`  
Status: draft

## Matter Summary — Schema

Location: `00_SYSTEM/schemas/SCHEMAS_MATTER_SUMMARY.md`  
Status: draft

## Solutions Schema

Location: `00_SYSTEM/schemas/SCHEMAS_SOLUTIONS.md`  
Status: draft

## Draft Placement Plan — Schema

Location: `00_SYSTEM/schemas/SCHEMAS_INBOX_TRIAGE.md`  
Status: draft

## Risk Model — Schema

Location: `00_SYSTEM/schemas/SCHEMAS_RISK_MODEL.md`  
Status: draft

## Office Day — Schema

Location: `00_SYSTEM/schemas/SCHEMAS_OFFICE_DAY.md`  
Status: draft

## Run Log Schema — Matter Dashboard

### Required Fields
- run_id
- timestamp
- operator
- ledger_doc_id
- approved_folder_id
- boundary_check: pass/fail
- inputs_used (versions/hashes)
- actions_taken
- rows_added
- rows_updated
- rows_flagged_needs_review
- refusal_reason (if any)
- status: ok | noop | refused | partial

### Storage
- Logs stored under `06_RUNS/`
- One log per run cycle
- Immutable after write

### Purpose
Enable audit, rollback analysis, and post-mortem review without re-running the system.

---

## Gmail Label Audit Log (NDJSON)

Each line is a JSON object with the following required fields:

- message_id
- gmail_thread_id
- label_applied_or_removed
- matter_id
- operation (add | remove)
- timestamp (UTC, ISO-8601)
- approving_human
- approval_artifact_reference
- reason
- status (ok | refused | failed)
