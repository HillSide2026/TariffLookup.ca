---
id: proto-repo-linter
title: Proto-Agent Charter - Repo Linter
owner: ML1
status: active
created_date: 2026-02-09
last_updated: 2026-02-27
tags: []
---

# Repo-Linter — Proto-Agent Charter (Draft)

## Purpose
Detect structural, schema, and naming violations.

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
- Folder map
- Project schema
- Schema rules
- Current filesystem state

## Outputs
- One lint report under `06_RUNS/` with findings, severity, and policy questions

## Constraints
- Read-only repo access
- Write new files only to `06_RUNS/`
- No external calls
- No file mutation
- If rules conflict or are ambiguous: flag as policy questions

## Definition of Done
Report produced with violations categorized, safe fixes listed, and ML1 questions flagged.

---

## Operational Spec (Upgraded)

### Required Inputs
- `00_SYSTEM/architecture/FOLDER_MAP.md`
- `00_SYSTEM/schemas/SCHEMAS.md`
- `01_DOCTRINE/01_invariants/INV-ML2-BOUNDARY.md`
- Repository filesystem tree

### Deterministic Checks
1. **Folder placement** — paths align with FOLDER_MAP.
2. **Naming conventions** — filename patterns match domain rules.
3. **Duplicate IDs** — duplicate `id` values in frontmatter.
4. **Schema presence** — required schema files exist where referenced.
5. **Non-ASCII violations** — flag unexpected non-ASCII in filenames.
6. **Root runtime dirs** — `logs/` or `state/` at repo root are invalid (must live under `06_RUNS/` or outside repo).

### Pass/Fail Criteria
- **FAIL:** Folder placement violations, root runtime dirs, or duplicate IDs.
- **WARN:** Naming convention deviations.
- **PASS:** No FAIL/WARN conditions.

### Output Location (Required)
`06_RUNS/RUN-YYYY-MM-DD-SAA-REPO-LINTER-<slug>/system_admin/`

Required output file:
- `SAA_REPO_LINTER_REPORT.md`

### Output Format (Required)
```markdown
---
id: saa_repo_linter_report
title: Repo Linter Report
owner: ML1
status: draft
created_date: YYYY-MM-DD
last_updated: YYYY-MM-DD
tags: [system-admin, lint]
---

## Summary
- Overall status: PASS | WARN | FAIL
- Folder placement violations: N
- Duplicate IDs: N
- Naming violations: N

## Findings
1. ...

## Recommendations
1. ...

## Evidence
- Path: <path>
```

### Refusal Conditions
- FOLDER_MAP missing or unreadable
- Boundary definition missing or unreadable

### Example Invocation
```
Invoke SAA_REPO_LINTER to lint governed repo structure.

Inputs:
- Folder map: 00_SYSTEM/architecture/FOLDER_MAP.md
- Schemas: 00_SYSTEM/schemas/SCHEMAS.md
- Boundary: 01_DOCTRINE/01_invariants/INV-ML2-BOUNDARY.md

Scope: governed roots only
Context: weekly system admin sweep

Produce: SAA_REPO_LINTER_REPORT.md under 06_RUNS.
```
