---
id: 06_runs__run_template__readme_md
title: RUN Template (MCP / Orchestrator)
owner: ML1
status: draft
version: 1.0
created_date: 2026-02-26
last_updated: 2026-02-26
tags: [run-template, mcp]
---
# RUN Template (MCP / Orchestrator)

This folder is a copyable scaffold for a single orchestrator run.

## Required files (schema-valid)
- manifest.json
- actions.jsonl
- outputs/ (folder)

## How to use
1) Copy this folder to a new run directory:
   - `RUN-YYYY-MM-DD-MCP-<slug>/`
2) Replace placeholders in manifest.json
3) Append one JSON object per line in actions.jsonl
4) Write markdown artifacts under outputs/ and index them in manifest.outputs_index with sha256

## Schema references
- `00_SYSTEM/schemas/run_manifest.schema.json`
- `00_SYSTEM/schemas/actions_log.schema.json`
