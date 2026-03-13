---
id: 02_playbooks__doc_drop_issue_list__acceptance_md
title: Doc Drop Issue List — Acceptance Criteria
owner: ML1
status: draft
version: 1.0
supersedes:
created_date: 2026-02-14
last_updated: 2026-02-14
tags: []
---

## Playbook Header
Playbook ID: PB-DOC_DROP_ISSUE_LIST-ACCEPTANCE
Version: 1.0
Status: draft

Principles Referenced: PRN-001, PRN-002, PRN-003, PRN-004, PRN-005, PRN-006, PRN-007, PRN-008, PRN-009
Policies Applied: POL-001, POL-002, POL-003, POL-004, POL-005, POL-006, POL-007, POL-008, POL-009
Protocols Enforced: PRO-001, PRO-002, PRO-003, PRO-004, PRO-005, PRO-006, PRO-007, PRO-008, PRO-009
Doctrine Invoked: 00_SYSTEM/constitution.md, 01_DOCTRINE/index.yaml

Inputs: TBD
Outputs: TBD
Acceptance Criteria: Produces `issue_list.md` and `task_list.md`, includes label + provenance, and enforces required gates.

# Acceptance Criteria
- Given a document drop, the run produces `issue_list.md` and `task_list.md` in run outputs.
- Outputs include a label and provenance reference.
- Gates `ml1_approval_required`, `classification_ok`, and `doctrine_conflict_detected` are enforced.

## Test Cases
1. Minimal doc drop produces an issue list with at least 3 items and a task list with at least 3 tasks.
2. Low-confidence classification blocks the run and records the decision in the run log.
3. External-facing output requires ML1 approval labeling.

## Evidence
- Run log link:
- Output paths:
