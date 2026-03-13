---
id: proto-metadata-enforcer
title: Proto-Agent Charter - Metadata Enforcer
owner: ML1
status: active
created_date: 2026-02-14
last_updated: 2026-02-27
tags: []
---

# Metadata-Enforcer — Proto-Agent Charter (Draft)

## Purpose
Ensure required frontmatter fields exist across governed artifact types.

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
- `00_SYSTEM/schemas/SCHEMAS.md`
- `00_SYSTEM/schemas/SCHEMAS_INBOX_TRIAGE.md` (as applicable)
- Artifact files under `01_DOCTRINE/`, `02_PLAYBOOKS/`, `03_TEMPLATES/`, `00_SYSTEM/agents/`

## Outputs
- One metadata compliance report under `06_RUNS/`

## Constraints
- Read-only repo access
- Write new files only to `06_RUNS/`
- No external calls
- No file mutation
- If schemas conflict: flag as policy questions

## Definition of Done
Report produced listing missing or empty required fields (id, version, status, and any schema-specific requirements).

---

## Operational Spec (Upgraded)

### Required Inputs
- `00_SYSTEM/schemas/SCHEMAS.md`
- `00_SYSTEM/schemas/SCHEMAS_INBOX_TRIAGE.md` (if applicable)
- `01_DOCTRINE/01_invariants/INV-ML2-BOUNDARY.md`
- Governed markdown files under `01_DOCTRINE/`, `02_PLAYBOOKS/`, `00_SYSTEM/`, `04_INITIATIVES/`

### Deterministic Checks
1. **Frontmatter presence** — file has YAML frontmatter.
2. **Required keys** — minimum keys: `id`, `title`, `owner`, `status`, `created_date`, `last_updated`.
3. **Empty value check** — required keys are non-empty.
4. **Status taxonomy** — `status` uses the allowed lifecycle states where defined.
5. **Schema-specific keys** — if schema applies, required keys are present.

### Pass/Fail Criteria
- **FAIL:** Missing frontmatter or missing required keys.
- **WARN:** Empty values or schema conflicts.
- **PASS:** All required keys present and non-empty.

### Output Location (Required)
`06_RUNS/RUN-YYYY-MM-DD-SAA-METADATA-ENFORCER-<slug>/system_admin/`

Required output file:
- `SAA_METADATA_ENFORCER_REPORT.md`

### Output Format (Required)
```markdown
---
id: saa_metadata_enforcer_report
title: Metadata Enforcer Report
owner: ML1
status: draft
created_date: YYYY-MM-DD
last_updated: YYYY-MM-DD
tags: [system-admin, metadata]
---

## Summary
- Overall status: PASS | WARN | FAIL
- Files checked: N
- Missing frontmatter: N
- Missing required keys: N

## Findings
1. ...

## Recommendations
1. ...

## Evidence
- Path: <path>
```

### Refusal Conditions
- Schema files missing or unreadable
- Boundary definition missing or unreadable

### Example Invocation
```
Invoke SAA_METADATA_ENFORCER to audit frontmatter compliance.

Inputs:
- Schemas: 00_SYSTEM/schemas/SCHEMAS.md
- Boundary: 01_DOCTRINE/01_invariants/INV-ML2-BOUNDARY.md

Scope: governed markdown only
Context: weekly system admin sweep

Produce: SAA_METADATA_ENFORCER_REPORT.md under 06_RUNS.
```
