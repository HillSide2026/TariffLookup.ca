---
id: 04_initiatives__ll_portfolio__05_matter_docketing__specs__matter_todo_output_schema_md
title: Matter To-Do Report Output Schema
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Matter To-Do Report Output Schema

**Status:** NORMATIVE
**Version:** 3.0
**Effective:** 2026-02-07

---

## Part A: Human-Readable Markdown Structure

### A.1 Document Order

```
1. YAML Frontmatter (fenced with ---)
2. # Firmwide To-Do Rollup (H1)
3. ## Executive Summary (H2)
4. ## Routing Summary (H2)
5. ## Action Queue (H2)
   - ### {lane_label} (H3)
     - #### {matter_id} — {matter_title} (H4, repeating)
6. ## Waiting / Follow-Up Queue (H2)
7. ## Unassigned Triage List (H2)
8. ## Exclusions Summary (H2)
```

### A.2 YAML Frontmatter

```yaml
---
generated_on: "YYYY-MM-DDTHH:MM:SS"
input_window_days: 14
emails_scanned: 500
classification_counts:
  ACTION_REQUIRED: 69
  WAITING_ON_OTHER: 2
  INFO_ONLY: 168
  NO_ACTION: 261
tasks_generated: 67
tasks_with_deadlines: 7
tasks_unassigned: 36
tasks_unrouted: 5
ledger_carry_forward_count: 12
version: "3.0"
---
```

### A.3 Executive Summary Format

```markdown
## Executive Summary

| Metric | Count |
|--------|-------|
| Emails Scanned | {emails_scanned} |
| Action Required | {ACTION_REQUIRED} |
| Waiting on Other | {WAITING_ON_OTHER} |
| Info Only | {INFO_ONLY} |
| Excluded (No Action) | {NO_ACTION} |

**Actionable Tasks:** {tasks_generated} ({tasks_with_deadlines} with deadlines)
**Unassigned:** {tasks_unassigned} (need manual mapping)
```

### A.4 Routing Summary Format

```markdown
## Routing Summary

**By Workstream:**

| Workstream | Count |
|------------|-------|
| DELIVERY | {count} |
| FULFILLMENT | {count} |
| MARKETING | {count} |
| MANAGEMENT | {count} |
| UNROUTED | {count} |

**By Lane:**

| Lane | Count |
|------|-------|
| LAWYER | {count} |
| NON_LAWYER | {count} |
| ADMIN_ACCOUNTS | {count} |
| INTAKE | {count} |
| UNROUTED | {count} |

**Low-Confidence Routing:** {count} tasks
```

### A.5 Action Queue Format

```markdown
## Action Queue

### Delivery — Lawyer

#### {matter_id} — {matter_title}

- [ ] {task_text} **[{due}]** `{badge}` _(last seen: {last_seen})_ `{routing_confidence}`
  - _Why: {why}_
  - _Evidence: {email_date} — {subject}_
  - _Confidence: {confidence}_
  - _Routing: {suggested_workstream}/{suggested_lane} — {routing_reason}_
  - _Next Action: {next_action_type}_

### Delivery — Non-lawyer
### Fulfillment — Admin/Accounts
### Marketing — Intake/Onboarding
### Management
### Unrouted / Needs Triage
```

Badge values: `NEW`, `CARRY-FORWARD`, `STALE`

### A.6 Waiting / Follow-Up Queue Format

```markdown
## Waiting / Follow-Up Queue

**{matter_id} — {matter_title}**
- {summary}
  - _From: {from} | {email_date}_
```

### A.7 Unassigned Triage List Format

```markdown
## Unassigned Triage List

| Task | From | Subject | Suggested Match |
|------|------|---------|-----------------|
| {task_text} | {from} | {subject} | {suggested_match or "_none_"} |
```

### A.8 Exclusions Summary Format

```markdown
## Exclusions Summary

| Category | Count |
|----------|-------|
| {category} | {count} |
```

---

## Part B: Machine-Readable JSON Schema

### B.1 Root Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "matter-todo-report.schema.json",
  "title": "Matter To-Do Report",
  "type": "object",
  "required": [
    "metadata",
    "routing_summary",
    "tasks",
    "waiting_items",
    "unassigned_items",
    "exclusions_summary"
  ],
  "properties": {
    "metadata": { "$ref": "#/$defs/Metadata" },
    "routing_summary": { "$ref": "#/$defs/RoutingSummary" },
    "tasks": {
      "type": "array",
      "items": { "$ref": "#/$defs/Task" }
    },
    "waiting_items": {
      "type": "array",
      "items": { "$ref": "#/$defs/WaitingItem" }
    },
    "unassigned_items": {
      "type": "array",
      "items": { "$ref": "#/$defs/UnassignedItem" }
    },
    "exclusions_summary": {
      "type": "array",
      "items": { "$ref": "#/$defs/ExclusionCategory" }
    }
  }
}
```

### B.2 Metadata Schema

```json
{
  "$defs": {
    "Metadata": {
      "type": "object",
      "required": [
        "generated_on",
        "input_window_days",
        "emails_scanned",
        "tasks_generated"
      ],
      "properties": {
        "generated_on": {
          "type": "string",
          "format": "date-time",
          "description": "ISO 8601 timestamp of report generation"
        },
        "input_window_days": {
          "type": "integer",
          "minimum": 1,
          "description": "Number of days in the input window"
        },
        "emails_scanned": {
          "type": "integer",
          "minimum": 0,
          "description": "Total emails processed"
        },
        "tasks_generated": {
          "type": "integer",
          "minimum": 0,
          "description": "Total tasks extracted"
        },
        "tasks_with_deadlines": {
          "type": "integer",
          "minimum": 0,
          "description": "Tasks with explicit deadlines"
        },
        "tasks_unassigned": {
          "type": "integer",
          "minimum": 0,
          "description": "Tasks without matter attribution"
        },
        "classification_counts": {
          "$ref": "#/$defs/ClassificationCounts"
        },
        "tasks_unrouted": {
          "type": "integer",
          "minimum": 0,
          "description": "Tasks where suggested_workstream or suggested_lane is UNROUTED"
        },
        "ledger_carry_forward_count": {
          "type": "integer",
          "minimum": 0,
          "description": "Number of tasks carried forward from the ledger (not observed in today's extraction)"
        },
        "version": {
          "type": "string",
          "description": "Schema version"
        }
      }
    },
    "ClassificationCounts": {
      "type": "object",
      "required": [
        "ACTION_REQUIRED",
        "WAITING_ON_OTHER",
        "INFO_ONLY",
        "NO_ACTION"
      ],
      "properties": {
        "ACTION_REQUIRED": { "type": "integer", "minimum": 0 },
        "WAITING_ON_OTHER": { "type": "integer", "minimum": 0 },
        "INFO_ONLY": { "type": "integer", "minimum": 0 },
        "NO_ACTION": { "type": "integer", "minimum": 0 }
      }
    }
  }
}
```

### B.3 Routing Summary Schema

```json
{
  "$defs": {
    "RoutingSummary": {
      "type": "object",
      "required": [
        "by_workstream",
        "by_lane",
        "total_unrouted",
        "total_low_confidence"
      ],
      "properties": {
        "by_workstream": {
          "type": "object",
          "required": ["DELIVERY", "FULFILLMENT", "MARKETING", "MANAGEMENT", "UNROUTED"],
          "properties": {
            "DELIVERY": { "type": "integer", "minimum": 0 },
            "FULFILLMENT": { "type": "integer", "minimum": 0 },
            "MARKETING": { "type": "integer", "minimum": 0 },
            "MANAGEMENT": { "type": "integer", "minimum": 0 },
            "UNROUTED": { "type": "integer", "minimum": 0 }
          }
        },
        "by_lane": {
          "type": "object",
          "required": ["LAWYER", "NON_LAWYER", "ADMIN_ACCOUNTS", "INTAKE", "UNROUTED"],
          "properties": {
            "LAWYER": { "type": "integer", "minimum": 0 },
            "NON_LAWYER": { "type": "integer", "minimum": 0 },
            "ADMIN_ACCOUNTS": { "type": "integer", "minimum": 0 },
            "INTAKE": { "type": "integer", "minimum": 0 },
            "UNROUTED": { "type": "integer", "minimum": 0 }
          }
        },
        "total_unrouted": {
          "type": "integer",
          "minimum": 0,
          "description": "Tasks where workstream or lane is UNROUTED"
        },
        "total_low_confidence": {
          "type": "integer",
          "minimum": 0,
          "description": "Tasks where routing_confidence is LOW"
        }
      }
    }
  }
}
```

### B.4 Task Schema

```json
{
  "$defs": {
    "Task": {
      "type": "object",
      "required": [
        "task_id",
        "matter_id",
        "classification",
        "task",
        "confidence",
        "badge",
        "last_seen",
        "ledger_status",
        "suggested_workstream",
        "suggested_lane",
        "routing_confidence",
        "routing_reason",
        "next_action_type",
        "evidence"
      ],
      "properties": {
        "task_id": {
          "type": "string",
          "description": "Stable identifier derived from hash of (normalized_task_text + matter_id + originating_message_ref). See MATTER_TODO_LEDGER.md Section 4."
        },
        "matter_id": {
          "type": "string",
          "description": "Matter ID or 'UNASSIGNED'"
        },
        "matter_title": {
          "type": ["string", "null"],
          "description": "Human-readable matter name if known"
        },
        "classification": {
          "type": "string",
          "const": "ACTION_REQUIRED",
          "description": "Tasks MUST have classification ACTION_REQUIRED"
        },
        "task": {
          "type": "string",
          "minLength": 10,
          "description": "Verb-first task description"
        },
        "why": {
          "type": "string",
          "description": "Short rationale for task extraction"
        },
        "due": {
          "type": ["string", "null"],
          "format": "date",
          "description": "Deadline if present in source; null otherwise. MUST NOT be invented."
        },
        "owner": {
          "type": ["string", "null"],
          "default": null,
          "description": "Assigned owner if explicit in email; null otherwise"
        },
        "confidence": {
          "type": "string",
          "enum": ["high", "medium", "low"],
          "description": "Actionability confidence per MATTER_TODO_CONFIDENCE_MODEL"
        },
        "badge": {
          "type": "string",
          "enum": ["NEW", "CARRY-FORWARD", "STALE"],
          "description": "Carry-forward status badge for report presentation"
        },
        "last_seen": {
          "type": "string",
          "format": "date",
          "description": "Date this task was most recently observed in extraction"
        },
        "first_seen": {
          "type": "string",
          "format": "date",
          "description": "Date this task was first extracted"
        },
        "ledger_status": {
          "type": "string",
          "enum": ["NEW", "TRIAGED", "WAITING", "DONE", "DROPPED", "STALE"],
          "description": "Current status in the task ledger. See MATTER_TODO_LEDGER.md Section 5."
        },
        "suggested_workstream": {
          "type": "string",
          "enum": ["DELIVERY", "FULFILLMENT", "MARKETING", "MANAGEMENT", "UNROUTED"],
          "description": "Operational system the task is routed to. Suggestion only, not an assignment."
        },
        "suggested_lane": {
          "type": "string",
          "enum": ["LAWYER", "NON_LAWYER", "ADMIN_ACCOUNTS", "INTAKE", "UNROUTED"],
          "description": "Role lane within the workstream. Suggestion only, not an assignment."
        },
        "routing_confidence": {
          "type": "string",
          "enum": ["HIGH", "MEDIUM", "LOW"],
          "description": "Confidence in the routing classification"
        },
        "routing_reason": {
          "type": "string",
          "description": "Short explanation anchored to evidence (quote-backed when possible)"
        },
        "next_action_type": {
          "type": "string",
          "enum": ["RESPOND", "REVIEW", "DRAFT", "FILE_SUBMIT", "SCHEDULE", "PAY_INVOICE", "SEND_REQUEST", "UPDATE_LOG", "OTHER"],
          "description": "Deterministic classification of the required next action"
        },
        "evidence": {
          "type": "array",
          "minItems": 1,
          "items": { "$ref": "#/$defs/EvidenceItem" }
        }
      }
    }
  }
}
```

### B.5 Evidence Item Schema

```json
{
  "$defs": {
    "EvidenceItem": {
      "type": "object",
      "required": [
        "email_date",
        "from",
        "subject",
        "quote"
      ],
      "properties": {
        "email_date": {
          "type": "string",
          "format": "date",
          "description": "Email date in YYYY-MM-DD format"
        },
        "from": {
          "type": "string",
          "description": "Sender name or email address"
        },
        "subject": {
          "type": "string",
          "description": "Email subject line"
        },
        "quote": {
          "type": "string",
          "minLength": 1,
          "description": "Verbatim sentence(s) supporting the task. MUST NOT be paraphrased."
        },
        "message_ref": {
          "type": ["string", "null"],
          "description": "Unique message identifier if available; null otherwise"
        }
      }
    }
  }
}
```

### B.6 Waiting Item Schema

```json
{
  "$defs": {
    "WaitingItem": {
      "type": "object",
      "required": [
        "matter_id",
        "summary",
        "from",
        "email_date"
      ],
      "properties": {
        "matter_id": {
          "type": "string",
          "description": "Matter ID or 'UNASSIGNED'"
        },
        "matter_title": {
          "type": ["string", "null"]
        },
        "summary": {
          "type": "string",
          "description": "Brief description of what is being waited on"
        },
        "from": {
          "type": "string"
        },
        "subject": {
          "type": "string"
        },
        "email_date": {
          "type": "string",
          "format": "date"
        }
      }
    }
  }
}
```

### B.7 Unassigned Item Schema

```json
{
  "$defs": {
    "UnassignedItem": {
      "type": "object",
      "required": [
        "task_id",
        "task",
        "from",
        "subject"
      ],
      "properties": {
        "task_id": {
          "type": "string"
        },
        "task": {
          "type": "string"
        },
        "from": {
          "type": "string"
        },
        "subject": {
          "type": "string"
        },
        "suggested_match": {
          "type": ["string", "null"],
          "description": "Suggested matter_id if partial signals exist"
        },
        "attribution_failure_reason": {
          "type": "string",
          "description": "Explanation of why attribution failed"
        }
      }
    }
  }
}
```

### B.8 Exclusion Category Schema

```json
{
  "$defs": {
    "ExclusionCategory": {
      "type": "object",
      "required": ["category", "count"],
      "properties": {
        "category": {
          "type": "string",
          "description": "Exclusion reason category"
        },
        "count": {
          "type": "integer",
          "minimum": 0
        }
      }
    }
  }
}
```

---

## Part C: Field Reference Table

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `metadata.generated_on` | datetime | YES | Report generation timestamp |
| `metadata.input_window_days` | integer | YES | Days in scan window |
| `metadata.emails_scanned` | integer | YES | Total emails processed |
| `metadata.tasks_generated` | integer | YES | Total tasks extracted |
| `metadata.tasks_with_deadlines` | integer | NO | Tasks with due dates |
| `metadata.tasks_unassigned` | integer | NO | Tasks needing triage |
| `metadata.classification_counts` | object | NO | Counts per classification |
| `metadata.tasks_unrouted` | integer | NO | Tasks with UNROUTED workstream or lane |
| `metadata.ledger_carry_forward_count` | integer | NO | Carry-forward task count |
| `routing_summary.by_workstream` | object | YES | Task counts per workstream |
| `routing_summary.by_lane` | object | YES | Task counts per lane |
| `routing_summary.total_unrouted` | integer | YES | Total UNROUTED tasks |
| `routing_summary.total_low_confidence` | integer | YES | Total LOW routing_confidence tasks |
| `task.task_id` | string | YES | Stable hash-based ID (see MATTER_TODO_LEDGER.md) |
| `task.matter_id` | string | YES | Matter ID or UNASSIGNED |
| `task.matter_title` | string | NO | Matter name if known |
| `task.classification` | enum | YES | Must be ACTION_REQUIRED |
| `task.task` | string | YES | Verb-first task text |
| `task.why` | string | YES | Extraction rationale |
| `task.due` | date/null | YES | Deadline or null |
| `task.owner` | string/null | NO | Explicit owner or null |
| `task.confidence` | enum | YES | high/medium/low |
| `task.badge` | enum | YES | NEW/CARRY-FORWARD/STALE |
| `task.last_seen` | date | YES | Date last observed in extraction |
| `task.first_seen` | date | NO | Date first extracted |
| `task.ledger_status` | enum | YES | NEW/TRIAGED/WAITING/DONE/DROPPED/STALE |
| `task.suggested_workstream` | enum | YES | DELIVERY/FULFILLMENT/MARKETING/MANAGEMENT/UNROUTED |
| `task.suggested_lane` | enum | YES | LAWYER/NON_LAWYER/ADMIN_ACCOUNTS/INTAKE/UNROUTED |
| `task.routing_confidence` | enum | YES | HIGH/MEDIUM/LOW |
| `task.routing_reason` | string | YES | Quote-backed routing explanation |
| `task.next_action_type` | enum | YES | RESPOND/REVIEW/DRAFT/FILE_SUBMIT/SCHEDULE/PAY_INVOICE/SEND_REQUEST/UPDATE_LOG/OTHER |
| `task.evidence` | array | YES | Supporting evidence |
| `evidence.email_date` | date | YES | YYYY-MM-DD |
| `evidence.from` | string | YES | Sender |
| `evidence.subject` | string | YES | Subject line |
| `evidence.quote` | string | YES | Verbatim quote |
| `evidence.message_ref` | string/null | NO | Message ID if available |

---

## Part D: Validation Rules

1. `task.classification` MUST equal `ACTION_REQUIRED` for all items in `tasks` array.
2. `task.due` MUST be null unless a deadline is explicitly stated in source email.
3. `task.owner` MUST be null unless an assignee is explicitly named in source email.
4. `evidence.quote` MUST be verbatim text, not paraphrased.
5. Sum of `classification_counts` values MUST equal `emails_scanned`.
6. `tasks_generated` MUST equal count of tasks extracted in today's run (excludes carry-forward-only tasks).
7. `tasks_unassigned` MUST equal count of tasks where `matter_id` equals "UNASSIGNED".
8. Every task MUST include a valid `badge` value (`NEW`, `CARRY-FORWARD`, or `STALE`).
9. Every task MUST include a `last_seen` date.
10. Every task MUST include a `ledger_status` value.
11. Tasks with `ledger_status` of `DONE` or `DROPPED` MUST NOT appear in the report.
12. Every task MUST include `suggested_workstream`, `suggested_lane`, `routing_confidence`, `routing_reason`, and `next_action_type`.
13. `suggested_workstream` MUST be one of: DELIVERY, FULFILLMENT, MARKETING, MANAGEMENT, UNROUTED.
14. `suggested_lane` MUST be one of: LAWYER, NON_LAWYER, ADMIN_ACCOUNTS, INTAKE, UNROUTED.
15. `routing_confidence` MUST be one of: HIGH, MEDIUM, LOW.
16. `next_action_type` MUST be one of: RESPOND, REVIEW, DRAFT, FILE_SUBMIT, SCHEDULE, PAY_INVOICE, SEND_REQUEST, UPDATE_LOG, OTHER.
17. UNROUTED MUST be used when signals are insufficient; routing MUST NOT guess.
18. Routing MUST NOT create an owner assignment unless explicitly stated in the email.
