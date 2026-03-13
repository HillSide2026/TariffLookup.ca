---
id: 02_playbooks__matter_dashboard__gmail_label_audit_log_format_md
title: Gmail Label Audit Log Format
owner: ML1
status: draft
version: 1.0
supersedes:
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

## Playbook Header
Playbook ID: 02_playbooks__matter_dashboard__gmail_label_audit_log_format_md
Version: 1.0
Status: draft

Principles Referenced: PRN-001, PRN-002, PRN-003, PRN-004, PRN-005, PRN-006, PRN-009
Policies Applied: POL-001, POL-004, POL-006, POL-009
Protocols Enforced: PRO-001, PRO-004, PRO-006, PRO-009
Doctrine Invoked: 00_SYSTEM/constitution.md, 01_DOCTRINE/index.yaml

Inputs: TBD
Outputs: TBD
Acceptance Criteria: TBD


# Gmail Label Audit Log Format

**File:** `06_RUNS/ops/gmail_label_audit.ndjson`

Each line is a JSON object with the following fields:

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
- error (optional)
