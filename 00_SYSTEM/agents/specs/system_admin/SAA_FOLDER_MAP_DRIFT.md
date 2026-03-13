---
id: proto-folder-map-drift
title: Proto-Agent Charter - Folder Map Drift
owner: ML1
status: active
created_date: 2026-02-09
last_updated: 2026-02-27
tags: []
---

# Folder-Map-Drift — Proto-Agent Charter (Draft)

## Purpose
Compare `FOLDER_MAP.md` to actual repo structure and report drift.

## Scope
This agent applies only to ML2 governed artifacts as defined in the
ML2 Ontology Boundary invariant: `01_DOCTRINE/01_invariants/INV-ML2-BOUNDARY.md`

In-scope artifacts include:

- Governed ontology layers (00_SYSTEM→10_ARCHIVE)
- Integration specifications located under `00_SYSTEM/integrations/`
- Metadata-bearing artifacts with valid frontmatter

Out-of-scope artifacts include:

- Repository infrastructure files (.gitignore, LICENSE, README.md, etc.)
- Runtime logs
- Scripts and tooling
- Environment configuration
- Secrets and credentials
- CI or tooling config

Boundary Reference: INV-ML2-BOUNDARY (01_DOCTRINE/01_invariants/INV-ML2-BOUNDARY.md)

## Authority
None. Advisory/draft output only.

## Inputs
- `FOLDER_MAP.md`
- `SCHEMAS.md`
- Filesystem state
- Prior drift reports

## Outputs
- One drift report under `06_RUNS/` with delta vs last report

## Constraints
- Read-only repo access
- Write new files only to `06_RUNS/`
- No external calls
- No file mutation
- Do not deep-scan file contents beyond frontmatter/filenames

## Definition of Done
Report produced with mapped vs actual counts, deltas, and recommended map updates.

---

## Operational Spec (Upgraded)

### Required Inputs
- `00_SYSTEM/architecture/FOLDER_MAP.md` (canonical map)
- `01_DOCTRINE/01_invariants/INV-ML2-BOUNDARY.md` (boundary definition)
- Repository filesystem tree (paths only)
- Prior drift report (most recent in `06_RUNS/`)

### Deterministic Checks
1. **Map parse check** — FOLDER_MAP.md is readable and contains a folder map block.
2. **Boundary check** — INV-ML2-BOUNDARY.md is readable and defines governed layers.
3. **Governed roots check** — all governed root folders exist; report missing/extra roots.
4. **Unexpected top-level folders** — any folder at repo root not in FOLDER_MAP is flagged.
5. **Unexpected governed subtrees** — new subtrees under governed roots not in map are flagged.
6. **Orphan map entries** — folders listed in FOLDER_MAP that do not exist are flagged.
7. **No deep content scan** — only paths and frontmatter headers (if present) may be read.

### Pass/Fail Criteria
- **PASS:** No missing governed roots, no unexpected top-level folders, no orphan map entries.
- **FAIL:** Any missing governed root, unexpected top-level folder, or orphan map entry.
- **WARN:** New subtrees detected under governed roots that are not mapped.

### Output Location (Required)
Create a run folder:
`06_RUNS/RUN-YYYY-MM-DD-SAA-FOLDER-MAP-DRIFT-<slug>/system_admin/`

Required output file:
- `SAA_FOLDER_MAP_DRIFT_REPORT.md`

### Output Format (Required)
```markdown
---
id: saa_folder_map_drift_report
title: Folder Map Drift Report
owner: ML1
status: draft
created_date: YYYY-MM-DD
last_updated: YYYY-MM-DD
tags: [system-admin, folder-map, drift]
---

## Summary
- Overall status: PASS | FAIL | WARN
- Governed roots missing: N
- Orphan map entries: N
- Unexpected top-level folders: N
- New unmapped subtrees: N

## Findings
1. ...

## Recommendations
1. ...

## Evidence
- FOLDER_MAP.md:line
- Path: <path>

## Assumptions / Confidence
- ...
```

### Refusal Conditions
- FOLDER_MAP.md missing or unreadable
- INV-ML2-BOUNDARY.md missing or unreadable
- Repo root not accessible
- Ambiguous boundary definition (cannot determine governed roots)

### Example Invocation
```
Invoke SAA_FOLDER_MAP_DRIFT to audit repo structure.

Inputs:
- FOLDER_MAP.md: 00_SYSTEM/architecture/FOLDER_MAP.md
- Boundary: 01_DOCTRINE/01_invariants/INV-ML2-BOUNDARY.md
- Repo root: .

Scope: governed roots only
Context: weekly system admin sweep

Produce: SAA_FOLDER_MAP_DRIFT_REPORT.md under 06_RUNS.
```
