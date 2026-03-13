---
id: 00_system__agents__specs__system_admin__readme_md
title: System Admin Agents
owner: ML1
status: draft
created_date: 2026-02-14
last_updated: 2026-02-14
tags: []
---

# System Admin Agents

This folder contains System Admin Agent (SAA) specs and shared artifacts used by the System Admin Sweep pipeline.

## How To Run
- Run graph: `00_SYSTEM/orchestration/run_graphs/system_admin_sweep.yaml`
- Run root: `06_RUNS/${run_id}/system_admin/`

## Where To Look First
- `SYSTEM_ADMIN_REPORT.md` — the unified summary of findings

## Required Outputs
See `SAA_OUTPUT_CONTRACT.md` and `SAA_OUTPUT_CONTRACT.json` for canonical filenames and merge rules.

## Agents In Scope
- `SAA_REPO_LINTER`
- `SAA_FOLDER_MAP_DRIFT`
- `SAA_METADATA_ENFORCER`
- `SAA_REFERENCE_INTEGRITY`
- `SAA_REGISTRY_SYNC`

## Shared Schemas
Located in `_shared/`:
- `findings.schema.json`
- `inventory.schema.json`
- `metadata_index.schema.json`
