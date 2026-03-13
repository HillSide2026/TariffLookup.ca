---
id: proto-reference-integrity
title: Proto-Agent Charter - Reference Integrity
owner: ML1
status: active
created_date: 2026-02-14
last_updated: 2026-02-27
tags: []
---

# Reference-Integrity — Proto-Agent Charter (Draft)

## Purpose
Detect broken internal links, stale file references, and orphaned docs.

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
- Repo file tree
- Markdown files and link targets
- `02_PLAYBOOKS/_registry/PLAYBOOK_INDEX.md`

## Outputs
- One integrity report under `06_RUNS/` listing failures and suggested fixes

## Constraints
- Read-only repo access
- Write new files only to `06_RUNS/`
- No external calls
- No file mutation
- Flag ambiguity as policy questions

## Definition of Done
Report produced with dead links, stale references, missing assets, and orphaned docs clearly listed, plus repair recommendations.

---

## Operational Spec (Upgraded)

### Required Inputs
- Repository file tree (paths only)
- Markdown files under governed layers
- `02_PLAYBOOKS/_registry/PLAYBOOK_INDEX.md` (if present)
- `01_DOCTRINE/01_invariants/INV-ML2-BOUNDARY.md`

### Deterministic Checks
1. **Broken relative links** — target path does not exist.
2. **Broken absolute repo links** — path outside repo or missing.
3. **Missing asset references** — images or attachments not found.
4. **Orphaned docs** — documents not referenced by any index (warn only).

### Pass/Fail Criteria
- **FAIL:** Any broken link to a governed artifact.
- **WARN:** Orphaned docs or ambiguous references.
- **PASS:** No broken links.

### Output Location (Required)
`06_RUNS/RUN-YYYY-MM-DD-SAA-REFERENCE-INTEGRITY-<slug>/system_admin/`

Required output file:
- `SAA_REFERENCE_INTEGRITY_REPORT.md`

### Output Format (Required)
```markdown
---
id: saa_reference_integrity_report
title: Reference Integrity Report
owner: ML1
status: draft
created_date: YYYY-MM-DD
last_updated: YYYY-MM-DD
tags: [system-admin, references]
---

## Summary
- Overall status: PASS | WARN | FAIL
- Broken links: N
- Missing assets: N
- Orphaned docs: N

## Findings
1. ...

## Recommendations
1. ...

## Evidence
- Source: <path>
- Target: <path>
```

### Refusal Conditions
- Boundary definition missing or unreadable
- Repo root not accessible

### Example Invocation
```
Invoke SAA_REFERENCE_INTEGRITY to validate internal links.

Inputs:
- Boundary: 01_DOCTRINE/01_invariants/INV-ML2-BOUNDARY.md
- Playbook index: 02_PLAYBOOKS/_registry/PLAYBOOK_INDEX.md

Scope: governed markdown only
Context: weekly system admin sweep

Produce: SAA_REFERENCE_INTEGRITY_REPORT.md under 06_RUNS.
```
