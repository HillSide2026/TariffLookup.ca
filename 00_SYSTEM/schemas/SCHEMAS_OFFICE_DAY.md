---
id: 00_system__schemas_office_day_md
title: Office Day - Schema
owner: ML1
status: draft
created_date: 2026-02-25
last_updated: 2026-02-25
tags: [schema, ops]
---

# SCHEMAS_OFFICE_DAY

## 1. Root Object

```yaml
office_day:
  date: YYYY-MM-DD
  docket_queue: [DocketEntry]
  pending_tasks: [TaskEntry]
  escalations: [EscalationEntry]
  notes: string (optional)
```

---

## 2. DocketEntry

- matter_id: string
- matter_stage: string
- solutions: [string]
- docket_action: string
- ready_for_docketing: boolean
- blockers: [string]
- risk_level: enum (LOW | MODERATE | HIGH | CRITICAL)

---

## 3. TaskEntry

- matter_id: string
- task_description: string
- owner: string
- due_context: enum (today | overdue | upcoming)
- status: enum (open | in_progress | waiting | complete)
- next_action: string

---

## 4. EscalationEntry

- matter_id: string
- reason: string
- risk_level: string
- ml1_required: boolean
- decision_status: enum (pending | resolved)
