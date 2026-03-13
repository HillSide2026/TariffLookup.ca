---
id: proto-registry-sync
title: Proto-Agent Charter - Registry Sync
owner: ML1
status: active
created_date: 2026-02-14
last_updated: 2026-02-27
tags: []
---

# Registry-Sync — Proto-Agent Charter (Draft)

## Purpose
Verify that playbook registry entries reflect actual playbooks.

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
- `02_PLAYBOOKS/_registry/PLAYBOOK_INDEX.md`
- `02_PLAYBOOKS/**/metadata.yaml`
- Repo file tree under `02_PLAYBOOKS/`

## Outputs
- One registry sync report under `06_RUNS/`

## Constraints
- Read-only repo access
- Write new files only to `06_RUNS/`
- No external calls
- No file mutation

## Definition of Done
Report produced listing missing registry entries, ghost entries, and status mismatches.

---

## Operational Spec (Upgraded)

### Required Inputs
- `02_PLAYBOOKS/_registry/PLAYBOOK_INDEX.md`
- `02_PLAYBOOKS/**/metadata.yaml`
- Repository file tree under `02_PLAYBOOKS/`
- `01_DOCTRINE/01_invariants/INV-ML2-BOUNDARY.md`

### Deterministic Checks
1. **Registry parse check** — PLAYBOOK_INDEX.md is readable.
2. **Missing entry check** — playbook with metadata not in registry.
3. **Ghost entry check** — registry entry path missing on disk.
4. **Status mismatch check** — registry status differs from metadata (if present).

### Pass/Fail Criteria
- **FAIL:** Missing or ghost entries.
- **WARN:** Status mismatches.
- **PASS:** Registry matches filesystem.

### Output Location (Required)
`06_RUNS/RUN-YYYY-MM-DD-SAA-REGISTRY-SYNC-<slug>/system_admin/`

Required output file:
- `SAA_REGISTRY_SYNC_REPORT.md`

### Output Format (Required)
```markdown
---
id: saa_registry_sync_report
title: Registry Sync Report
owner: ML1
status: draft
created_date: YYYY-MM-DD
last_updated: YYYY-MM-DD
tags: [system-admin, registry]
---

## Summary
- Overall status: PASS | WARN | FAIL
- Missing entries: N
- Ghost entries: N
- Status mismatches: N

## Findings
1. ...

## Recommendations
1. ...

## Evidence
- Registry: 02_PLAYBOOKS/_registry/PLAYBOOK_INDEX.md
- Path: <path>
```

### Refusal Conditions
- Registry file missing or unreadable
- Boundary definition missing or unreadable

### Example Invocation
```
Invoke SAA_REGISTRY_SYNC to reconcile playbook registry.

Inputs:
- Registry: 02_PLAYBOOKS/_registry/PLAYBOOK_INDEX.md
- Boundary: 01_DOCTRINE/01_invariants/INV-ML2-BOUNDARY.md

Scope: playbooks only
Context: weekly system admin sweep

Produce: SAA_REGISTRY_SYNC_REPORT.md under 06_RUNS.
```
