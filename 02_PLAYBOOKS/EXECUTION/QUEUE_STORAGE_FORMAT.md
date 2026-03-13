---
id: 02_playbooks__execution__queue_storage_format_md
title: Queue Storage Format — Stage 2.6
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Queue Storage Format — Stage 2.6

## Purpose

Define how proposals are stored, indexed, and retrieved for batch review.

---

## Design Principles

1. **File-backed** — No database required; inspectable with standard tools
2. **Append-only decisions** — History preserved
3. **Addressable** — Every proposal retrievable by ID
4. **Filterable** — Support grouping by type, domain, confidence
5. **Human-readable** — Markdown for review, JSON for automation

---

## Directory Structure

```
06_RUNS/EXECUTION/
├── queue/
│   ├── pending/           # Proposals awaiting review
│   │   ├── PROP-20260130-001.json
│   │   ├── PROP-20260130-002.json
│   │   └── ...
│   ├── approved/          # Approved, awaiting execution
│   │   └── ...
│   ├── rejected/          # Rejected proposals (archived)
│   │   └── ...
│   ├── deferred/          # Deferred for later review
│   │   └── ...
│   └── executed/          # Successfully executed
│       └── ...
├── manifests/
│   ├── queue_manifest.json      # Current queue state
│   └── queue_manifest_history/  # Historical snapshots
├── batches/
│   ├── BATCH-20260130-001.md    # Batch review worksheets
│   └── ...
└── logs/
    └── decision_log.ndjson      # Append-only decision log
```

---

## Queue Manifest Schema

The manifest provides a real-time index of queue state.

```json
{
  "manifest_version": "1.0",
  "generated_at": "2026-01-30T04:30:00Z",

  "summary": {
    "total_pending": 15,
    "total_approved": 3,
    "total_rejected": 2,
    "total_deferred": 1,
    "total_executed": 1
  },

  "pending_by_type": {
    "Operations — Inquiries": 5,
    "Matters — Activity": 4,
    "System Notification": 3,
    "Firm Management — Vendors / Billing": 2,
    "Matters — Client": 1
  },

  "pending_by_confidence": {
    "high": 2,
    "medium": 12,
    "low": 1
  },

  "pending_by_domain": {
    "soulpepper.com": 3,
    "lawpro.ca": 2,
    "google.com": 4,
    "other": 6
  },

  "oldest_pending": "2026-01-29T10:00:00Z",
  "newest_pending": "2026-01-30T04:00:00Z",

  "proposals": [
    {
      "id": "PROP-20260130-001",
      "status": "executed",
      "type": "Operations — Inquiries",
      "confidence_band": "medium",
      "created_at": "2026-01-30T04:00:00Z"
    }
  ]
}
```

---

## Decision Log Format (NDJSON)

Append-only log of all decisions.

```json
{"timestamp":"2026-01-30T04:15:00Z","proposal_id":"PROP-20260130-001","action":"approved","by":"ML1","notes":"Classifier calibration needed"}
{"timestamp":"2026-01-30T04:15:01Z","proposal_id":"PROP-20260130-001","action":"executed","result":"success"}
```

---

## File Naming Convention

| Type | Pattern | Example |
|------|---------|---------|
| Proposal | `PROP-YYYYMMDD-NNN.json` | `PROP-20260130-001.json` |
| Batch | `BATCH-YYYYMMDD-NNN.md` | `BATCH-20260130-001.md` |
| Manifest | `queue_manifest.json` | (single file, overwritten) |

---

## Operations

### Add Proposal to Queue

1. Generate proposal ID
2. Write JSON to `queue/pending/`
3. Update manifest

### Approve Proposal

1. Move file from `pending/` to `approved/`
2. Update proposal status in JSON
3. Append to decision log
4. Update manifest

### Execute Proposal

1. Perform action
2. Move file from `approved/` to `executed/`
3. Update proposal with execution result
4. Append to decision log
5. Update manifest

### Reject Proposal

1. Move file from `pending/` to `rejected/`
2. Update proposal status
3. Append to decision log
4. Update manifest

---

## Inspection Commands

```bash
# Count pending proposals
ls 06_RUNS/EXECUTION/queue/pending/ | wc -l

# View queue summary
cat 06_RUNS/EXECUTION/manifests/queue_manifest.json | jq '.summary'

# List pending by type
cat 06_RUNS/EXECUTION/manifests/queue_manifest.json | jq '.pending_by_type'

# View recent decisions
tail -10 06_RUNS/EXECUTION/logs/decision_log.ndjson
```

---

## Validation Rules

1. Manifest must always reflect actual directory contents
2. No proposal may exist in multiple status directories
3. Decision log entries must be append-only
4. Every status change must be logged
