---
id: 00_system__agents__specs__system_admin__saa_output_contract_md
title: System Admin Sweep Output Contract
owner: ML1
status: draft
created_date: 2026-02-14
last_updated: 2026-02-27
tags: []
---

# System Admin Sweep Output Contract

## Scope
Applies to the System Admin Sweep pipeline and the following SAA agents:
- SAA_REPO_LINTER
- SAA_FOLDER_MAP_DRIFT
- SAA_METADATA_ENFORCER
- SAA_REFERENCE_INTEGRITY
- SAA_REGISTRY_SYNC

## Canonical Run Root
All artifacts are written under:

`06_RUNS/${run_id}/system_admin/`

## Required Outputs

### Canonical Files
- `06_RUNS/${run_id}/system_admin/inventory.json`
- `06_RUNS/${run_id}/system_admin/findings.json`
- `06_RUNS/${run_id}/system_admin/findings.md`
- `06_RUNS/${run_id}/system_admin/SYSTEM_ADMIN_REPORT.md`

### Per-Agent Appendices
- `06_RUNS/${run_id}/system_admin/appendix_repo_linter.md`
- `06_RUNS/${run_id}/system_admin/appendix_folder_map_drift.md`
- `06_RUNS/${run_id}/system_admin/appendix_metadata_enforcer.md`
- `06_RUNS/${run_id}/system_admin/appendix_reference_integrity.md`
- `06_RUNS/${run_id}/system_admin/appendix_registry_sync.md`

### Per-Agent Findings (Intermediate)
- `06_RUNS/${run_id}/system_admin/findings_SAA_REPO_LINTER.json`
- `06_RUNS/${run_id}/system_admin/findings_SAA_FOLDER_MAP_DRIFT.json`
- `06_RUNS/${run_id}/system_admin/findings_SAA_METADATA_ENFORCER.json`
- `06_RUNS/${run_id}/system_admin/findings_SAA_REFERENCE_INTEGRITY.json`
- `06_RUNS/${run_id}/system_admin/findings_SAA_REGISTRY_SYNC.json`

## File Formats

### inventory.json (JSON)
List of files with fields:
- `path` (string)
- `type_guess` (string)
- `category_guess` (string)
- `exists` (boolean)
- `size_bytes` (integer)
- `last_modified` (string, optional)

The inventory is produced by **SAA_REPO_LINTER** and is canonical for the sweep.

### findings.json (JSON)
Array of findings with fields:
- `id` (string, stable)
- `agent` (one of the five SAAs)
- `severity` (BLOCKER | MAJOR | MINOR | INFO)
- `category` (naming | structure | drift | metadata | reference | registry)
- `title` (string)
- `description` (string)
- `affected_paths` (array of strings)
- `suggested_fix` (string, optional)
- `references` (array of {path, anchor}, optional)
- `created_at` (timestamp string)

### findings.md / SYSTEM_ADMIN_REPORT.md (Markdown)
Human-readable summaries generated from `findings.json`.

## Merge Rules
- Each agent writes its findings to its own intermediate file:
  `findings_<agent>.json`
- A merge step combines all intermediate files into `findings.json`.
- De-duplication key: `(category, title, affected_paths)`
- Deterministic ordering: `severity`, then `category`, then `title`, then `agent`
- `SYSTEM_ADMIN_REPORT.md` is regenerated from `findings.json` at the end of the sweep.
- Appendices are generated per agent from that agent’s `findings_<agent>.json`.

## Severity Rules
- **BLOCKER:** violates repository invariants or prevents reliable operation of the system admin pipeline
- **MAJOR:** significant drift or incompleteness that will cause downstream confusion
- **MINOR:** polish or non-critical inconsistencies
- **INFO:** notes or suggestions

## Failure Behavior
If BLOCKER findings are produced, the run is marked failed **and** reports are still rendered.

---

## Operational Spec (Upgraded)

### Required Inputs
- This contract document (`00_SYSTEM/AGENTS/specs/system_admin/SAA_OUTPUT_CONTRACT.md`)
- Contract schema file (`00_SYSTEM/AGENTS/specs/system_admin/SAA_OUTPUT_CONTRACT.json`)
- Run identifier: `RUN-YYYY-MM-DD-SYSTEM-ADMIN-SWEEP-<slug>`
- Run root: `06_RUNS/${run_id}/system_admin/`
- Per-agent intermediate files (if generated):
  - `findings_SAA_REPO_LINTER.json`
  - `findings_SAA_FOLDER_MAP_DRIFT.json`
  - `findings_SAA_METADATA_ENFORCER.json`
  - `findings_SAA_REFERENCE_INTEGRITY.json`
  - `findings_SAA_REGISTRY_SYNC.json`

### Deterministic Checks
1. **Run root check** — `06_RUNS/${run_id}/system_admin/` exists.
2. **Canonical files check** — all required canonical files exist.
3. **Appendix check** — all per-agent appendices exist.
4. **Intermediate findings check** — per-agent findings files exist.
5. **JSON schema check** — `inventory.json` and `findings.json` conform to contract schema.
6. **Merge rules check** — `findings.json` is deduped and ordered per contract.

### Pass/Fail Criteria
- **FAIL:** Any required file missing or invalid JSON schema.
- **WARN:** Extra files present or merge ordering inconsistent.
- **PASS:** All required outputs exist and validate.

### Output Location (Required)
`06_RUNS/RUN-YYYY-MM-DD-SAA-OUTPUT-CONTRACT-<slug>/system_admin/`

Required output file:
- `SAA_OUTPUT_CONTRACT_REPORT.md`

### Output Format (Required)
```markdown
---
id: saa_output_contract_report
title: System Admin Output Contract Report
owner: ML1
status: draft
created_date: YYYY-MM-DD
last_updated: YYYY-MM-DD
tags: [system-admin, output-contract]
---

## Summary
- Overall status: PASS | WARN | FAIL
- Missing required files: N
- Invalid JSON files: N
- Merge rule violations: N

## Findings
1. ...

## Recommendations
1. ...

## Evidence
- Run root: 06_RUNS/<run_id>/system_admin/
- Path: <path>
```

### Refusal Conditions
- Contract doc or schema missing/unreadable
- Run root not accessible
- Run identifier not provided

### Example Invocation
```
Validate system admin sweep outputs for run:
RUN-2026-02-27-SYSTEM-ADMIN-SWEEP-001122Z

Inputs:
- Contract doc: 00_SYSTEM/AGENTS/specs/system_admin/SAA_OUTPUT_CONTRACT.md
- Contract schema: 00_SYSTEM/AGENTS/specs/system_admin/SAA_OUTPUT_CONTRACT.json
- Run root: 06_RUNS/RUN-2026-02-27-SYSTEM-ADMIN-SWEEP-001122Z/system_admin/

Produce: SAA_OUTPUT_CONTRACT_REPORT.md under 06_RUNS.
```
