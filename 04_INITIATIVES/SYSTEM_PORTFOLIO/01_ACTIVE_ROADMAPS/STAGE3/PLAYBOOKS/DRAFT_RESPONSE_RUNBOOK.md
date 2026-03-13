---
id: 02_playbooks__stage3__draft_response_runbook_md
title: Stage 3.6 Draft Response Runbook
owner: ML1
status: draft
version: 1.0
supersedes:
created_date: 2026-02-11
last_updated: 2026-02-11
tags: [stage3, runbook, drafts]
---

## Playbook Header
Playbook ID: 02_playbooks__stage3__draft_response_runbook_md
Version: 1.0
Status: draft

Principles Referenced: PRN-001, PRN-002, PRN-003, PRN-004, PRN-005, PRN-006, PRN-009
Policies Applied: POL-003, POL-004, POL-005, POL-006, POL-009
Protocols Enforced: PRO-003, PRO-004, PRO-005, PRO-006, PRO-009
Doctrine Invoked: 00_SYSTEM/constitution.md, 01_DOCTRINE/index.yaml

Inputs: TBD
Outputs: TBD
Acceptance Criteria: TBD


# Stage 3.6 — Draft Response Runbook

## Purpose
Define the controlled workflow for generating internal-only draft responses under Stage 3.6, including logging and boundary enforcement.

## Preconditions
- Stage 3.6 authorized (internal-only drafts).
- Use the draft template: `04_INITIATIVES/SYSTEM_PORTFOLIO/01_ACTIVE_ROADMAPS/STAGE3/PLAYBOOKS/DRAFT_RESPONSE_TEMPLATE.md`.
- Outputs must remain local to repo.

## Approved Output Locations
- Drafts: `06_RUNS/STAGE3.6/DRAFTS/`
- Run logs: `06_RUNS/STAGE3.6/`

## Forbidden Output Locations
- `09_INBOX/`
- `00_SYSTEM/`
- `01_DOCTRINE/`
- `05_MATTERS/`
- Any external integrations

## Workflow (Manual)
1. Select test input or ledger item.
2. Generate draft scaffold using the template (no send-ready wording).
3. Assign classification tag and complete construction protocol fields.
4. Save to `06_RUNS/STAGE3.6/DRAFTS/` with naming `DRAFT-YYYY-MM-DD-<slug>.md`.
5. Log the run in `06_RUNS/STAGE3.6/` with references to draft files.

## Workflow (Scripted)
Use: `00_SYSTEM/scripts/run_draft_response.py`

Example:
```
python3 00_SYSTEM/scripts/run_draft_response.py --task-id <TASK_ID>
```

The script enforces boundary guards and writes:
- Drafts to `06_RUNS/STAGE3.6/DRAFTS/`
- Run logs to `06_RUNS/STAGE3.6/`

## Boundary Guard
All writes must pass the guard defined in `00_SYSTEM/scripts/run_draft_response.py`.
If a write target falls outside approved directories, execution must halt.

## Logging Requirements
Each run log must include:
- Inputs used (task_id / matter_id / scenario)
- Draft file paths
- Boundary guard result
- Any missing information / assumptions

## Failure Conditions
- Any draft feels send-ready
- Any draft exported or pasted into external systems
- Missing classification tag or construction protocol
