---
id: 02_playbooks___registry__structure_policy_md
title: Playbook Structure Policy
owner: ML1
status: draft
version: 1.0
supersedes:
created_date: 2026-02-14
last_updated: 2026-02-14
tags: [policy, structure, playbooks]
---

# Playbook Structure Policy

## Definitions

Playbook:
- A repeatable workflow.
- Must include `README.md`, `metadata.yaml`, `steps.yaml`, and `acceptance.md`.

Asset:
- A reusable noun used by playbooks (schemas, rubrics, worksheets, taxonomies, log formats, reference).
- Stored under `_assets/`.

## Placement

- Workflows live in `core/`, `substantive/`, `execution/`, or `system/`.
- Non-workflow material belongs in `_assets/`.
- Indexes and policy live in `_registry/`.

## Naming

- Folder names use `lowercase_snake_case`.
- No numeric prefixes inside `02_PLAYBOOKS/`.
- No stage markers in playbook names.
