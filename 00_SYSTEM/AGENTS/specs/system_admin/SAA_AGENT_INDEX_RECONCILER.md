---
id: proto-agent-index-reconciler
title: Proto-Agent Charter - Agent Index Reconciler
owner: ML1
status: active
created_date: 2026-02-18
last_updated: 2026-02-27
tags: []
---

# Agent-Index-Reconciler — Proto-Agent Charter (Draft)

## Purpose
Reconcile the Agent Index (in `00_SYSTEM/AGENTS/specs/AGENT_TYPOLOGY.md`) against the
current repo state and report drift.

## Scope
This agent applies only to ML2 governed artifacts as defined in the
ML2 Ontology Boundary invariant: `01_DOCTRINE/01_invariants/INV-ML2-BOUNDARY.md`

In-scope artifacts include:

- System agents in `00_SYSTEM/AGENTS/`
- System admin agent specs in `00_SYSTEM/AGENTS/specs/system_admin/`
- Agent frameworks in `00_SYSTEM/AGENTS/specs/`
- Practice area master agents under `02_PLAYBOOKS/**/AGENTS/` and `02_PLAYBOOKS/**/agents/`
- Other agent specs named `AGENT_*` or `AGENT_SPEC-*` under governed layers

Out-of-scope artifacts include:

- Runtime logs
- Scripts and tooling
- Environment configuration
- Secrets and credentials
- CI or tooling config
- Drafts outside governed layers

Boundary Reference: INV-ML2-BOUNDARY (01_DOCTRINE/01_invariants/INV-ML2-BOUNDARY.md)

## Authority
None. Advisory/draft output only.

## Inputs
- `00_SYSTEM/AGENTS/specs/AGENT_TYPOLOGY.md`
- Filesystem state
- Prior reconciliation reports (if any)

## Outputs
- One reconciliation report under `06_RUNS/` with:
  - additions (present in repo, missing in index)
  - removals (in index, missing in repo)
  - path changes or duplicate locations
  - naming or status mismatches (from frontmatter if present)
  - recommended updates to the Agent Index section

## Constraints
- Read-only repo access
- Write new files only to `06_RUNS/`
- No external calls
- No file mutation
- Do not deep-scan file contents beyond frontmatter/filenames

## Definition of Done
Report produced with a clear delta against the current Agent Index and
actionable update notes.

---

## Operational Spec (Upgraded)

### Required Inputs
- `00_SYSTEM/AGENTS/specs/AGENT_TYPOLOGY.md`
- `01_DOCTRINE/01_invariants/INV-ML2-BOUNDARY.md`
- Agent directories:
  - `00_SYSTEM/AGENTS/`
  - `00_SYSTEM/AGENTS/specs/system_admin/`
  - `00_SYSTEM/AGENTS/specs/`
  - `02_PLAYBOOKS/**/AGENTS/`
  - `02_PLAYBOOKS/**/agents/`

### Deterministic Checks
1. **Index parse check** — Agent Typology is readable and contains all index tables.
2. **Repo inventory check** — Enumerate agent spec files by path convention.
3. **Missing entry check** — Repo file exists but no index entry found.
4. **Ghost entry check** — Index entry points to a non-existent file.
5. **Duplicate path check** — Same agent name appears at multiple paths.
6. **Status mismatch check** — Frontmatter `status` disagrees with index `Status`.
7. **Class mismatch check** — Index `Class` not aligned with path category.

### Pass/Fail Criteria
- **FAIL:** Any missing entry or ghost entry.
- **WARN:** Duplicate paths, status mismatches, or class mismatches.
- **PASS:** No FAIL/WARN conditions.

### Output Location (Required)
`06_RUNS/RUN-YYYY-MM-DD-SAA-AGENT-INDEX-RECONCILER-<slug>/system_admin/`

Required output file:
- `SAA_AGENT_INDEX_RECONCILER_REPORT.md`

### Output Format (Required)
```markdown
---
id: saa_agent_index_reconciler_report
title: Agent Index Reconciler Report
owner: ML1
status: draft
created_date: YYYY-MM-DD
last_updated: YYYY-MM-DD
tags: [system-admin, agent-index]
---

## Summary
- Overall status: PASS | WARN | FAIL
- Missing entries: N
- Ghost entries: N
- Duplicate paths: N
- Status mismatches: N

## Findings
1. ...

## Recommendations
1. ...

## Evidence
- AGENT_TYPOLOGY.md:line
- Path: <path>
```

### Refusal Conditions
- Agent Typology missing or unreadable
- Boundary definition missing or unreadable
- Repo root not accessible

### Example Invocation
```
Invoke SAA_AGENT_INDEX_RECONCILER to validate agent index.

Inputs:
- Agent typology: 00_SYSTEM/AGENTS/specs/AGENT_TYPOLOGY.md
- Boundary: 01_DOCTRINE/01_invariants/INV-ML2-BOUNDARY.md

Scope: governed agent specs only
Context: weekly system admin sweep

Produce: SAA_AGENT_INDEX_RECONCILER_REPORT.md under 06_RUNS.
```
