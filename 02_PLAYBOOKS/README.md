---
id: 02_playbooks__readme_md
title: Playbooks
owner: ML1
status: draft
version: 1.0
supersedes:
created_date: 2026-01-25
last_updated: 2026-02-25
tags: []
---

## Playbook Header
Playbook ID: 02_playbooks__readme_md
Version: 1.0
Status: draft

Principles Referenced: PRN-001, PRN-002, PRN-003, PRN-004, PRN-005, PRN-006, PRN-008, PRN-009
Policies Applied: POL-003, POL-004, POL-006, POL-007, POL-009, POL-011
Protocols Enforced: PRO-003, PRO-004, PRO-006, PRO-007, PRO-009, PRO-011
Doctrine Invoked: 00_SYSTEM/constitution.md, 01_DOCTRINE/index.yaml

Inputs: TBD
Outputs: TBD
Acceptance Criteria: TBD


# Playbooks

Repeatable workflows and SOPs derived from doctrine.

## Service Architecture (Practice Areas)

Practice-area containers include both Strategies and Solutions, plus shared execution artifacts:

```
02_PLAYBOOKS/<PRACTICE_AREA>/
├── STRATEGIES/    # High-value engagement architectures
├── SOLUTIONS/     # Productized solution frames
├── (shared execution artifacts)
```

Strategies require ML1 approval to create. Each strategy folder must include:

- STRATEGY_SCOPE.md
- STRATEGY_ARCHITECTURE.md
- COMPONENT_SOLUTIONS.md
- RISK_SURFACE.md
- VERSION.md

Strategies are not playbooks. Playbooks remain the execution layer.

## Taxonomy

- `core/`: lifecycle backbone workflows (intake/triage/scaffold/extract/update).
- `substantive/`: legal-work workflows (review/draft/file/analyze) regardless of domain.
- `execution/`: deliverable-generation workflows (emails, memos, escalation packets).
- `system/`: meta-workflows that modify ML2 itself (doctrine/policy/template processes).
- `_registry/`: navigation + status registry only (no workflows).
- `_assets/`: reusable assets (schemas, rubrics, worksheets, formats) used by playbooks.

## SYSTEM PLAYBOOKS

These are non-practice playbooks outside the practice-area service architecture, grouped here for clarity only (no restructure).

System Core: `02_PLAYBOOKS/core/`, `02_PLAYBOOKS/system/`
Execution and QA: `02_PLAYBOOKS/EXECUTION/`, `02_PLAYBOOKS/STAGE3/`
Operations Workflows: `02_PLAYBOOKS/INBOX_TRIAGE/`, `02_PLAYBOOKS/MATTER_DASHBOARD/`
Infrastructure and Support: `02_PLAYBOOKS/_assets/`, `02_PLAYBOOKS/_registry/`

Rules:
- Must include YAML frontmatter per `/00_SYSTEM/schemas/SCHEMAS.md`
- `version` and `supersedes` live in YAML frontmatter; Playbook Header `Version` must match `version`
- May reference doctrine IDs
- If a playbook conflicts with doctrine, doctrine wins
- Folders under `core/`, `substantive/`, `execution/`, and `system/` must be workflows and must include `README.md`, `metadata.yaml`, `steps.yaml`, and `acceptance.md`; otherwise place them under `_assets/`.
- Anything that is not a repeatable workflow does not belong in `core/`, `substantive/`, `execution/`, or `system/`.

Registry: `02_PLAYBOOKS/_registry/README.md`
Playbook index: `02_PLAYBOOKS/_registry/PLAYBOOK_INDEX.md`
Status manifests (derived views): `02_PLAYBOOKS/_registry/ACTIVE_INDEX.md`, `02_PLAYBOOKS/_registry/DRAFT_INDEX.md`
Structure policy: `02_PLAYBOOKS/_registry/STRUCTURE_POLICY.md`
