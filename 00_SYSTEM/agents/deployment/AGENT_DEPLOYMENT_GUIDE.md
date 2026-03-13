---
id: 02_playbooks__agent_deployment_guide_md
title: Agent Deployment Guide
owner: ML1
status: draft
version: 1.0
supersedes:
created_date: 2026-02-08
last_updated: 2026-02-24
tags: []
---

## Playbook Header
Playbook ID: 02_playbooks__agent_deployment_guide_md
Version: 1.0
Status: draft

Principles Referenced: PRN-001, PRN-002, PRN-003, PRN-004, PRN-005, PRN-006, PRN-009
Policies Applied: POL-002, POL-003, POL-004, POL-005, POL-006, POL-009, POL-010, POL-011
Protocols Enforced: PRO-002, PRO-003, PRO-004, PRO-005, PRO-006, PRO-009, PRO-010, PRO-011
Doctrine Invoked: 00_SYSTEM/constitution.md, 01_DOCTRINE/index.yaml

Inputs: TBD
Outputs: TBD
Acceptance Criteria: TBD


# Agent Deployment Guide

**Version:** 2.0
**Last Updated:** 2026-02-24
**Status:** Active

---

## Overview

This guide documents how to deploy and invoke the system-level agents in the Levine Law Second Brain system. It defines *how agents are used*, *what they are allowed to do*, and *where human authority intervenes*.

**Runtime:** Claude Code agents
**Stage:** 2.1 (Agent Runtime Setup)

This document is an operational artifact. Agent Definitions remain the source of truth for permissions and constraints.

---

## Agent Inventory

| Agent ID | Name                | Purpose                                            |
| -------- | ------------------- | -------------------------------------------------- |
| SMA-001  | System Governance   | Validate compliance, review changes, enforce rules |
| SMA-002  | Portfolio Planning  | Manage roadmaps, backlog, stage transitions        |
| SMA-003  | Integration Steward | Govern integration specs (read-only)               |
| SMA-004  | Knowledge Curation  | Organize, index, maintain knowledge artifacts      |
| SMA-005  | Runbook & QA        | Draft runbooks, validate artifact quality          |
| SMA-006  | System Librarian    | Canonical placement, registration, validation      |

---

## Agent Definition vs Playbook

### Agent Definition

* Located in `00_SYSTEM/AGENTS/`
* Defines agent capabilities, permissions, and constraints
* Machine-readable contract for agent behavior
* Includes:

  * Authority scope
  * Allowed inputs
  * Allowed outputs
  * Explicit non-authority
  * Refusal conditions

### Playbook

* Located in `02_PLAYBOOKS/`
* Human-readable operational guide
* Explains how to invoke and use agents correctly
* Includes:

  * Invocation patterns
  * Examples
  * Troubleshooting

**Rule:** Playbooks may *never* expand authority beyond what is defined in Agent Definitions.

---

## Invocation Patterns

### General Pattern

```
Invoke agent [AGENT_ID] to [ACTION].

Inputs:
- [Input 1]: [path or value]
- [Input 2]: [path or value]

Scope: [explicit, bounded scope]
Context: [relevant context]

Produce: [expected output type]
```

**Scope is normative.** Agents must refuse to act outside the declared scope.

---

## Agent Invocation Guides

### SMA-001 — System Governance

**Use when:** Validating PR compliance, checking folder placement, reviewing doctrine alignment

```
Review PR changeset for governance compliance.

Inputs:
- PR diff or artifact paths: [paths]
- Folder map: 00_SYSTEM/architecture/FOLDER_MAP.md
- Schemas: 00_SYSTEM/schemas/SCHEMAS.md
- Doctrine: 01_DOCTRINE/

Scope: full governance review
Context: PR review for [PR description]

Produce: Governance compliance report with pass/fail and recommendations.
```

---

### SMA-002 — Portfolio Planning

**Use when:** Reviewing backlog, preparing stage closure, sequencing roadmap items

```
Review backlog and prepare stage closure recommendation.

Inputs:
- Backlog: 04_INITIATIVES/SYSTEM_PORTFOLIO/BACKLOG.md
- Stage artifacts: 04_INITIATIVES/SYSTEM_PORTFOLIO/01_ACTIVE_ROADMAPS/STAGE2/STAGE2.1/
- DoD checklist: STAGE2_AUTHORIZATION_KICKOFF.md

Scope: Stage 2.1 closure review
Context: Weekly cycle 2026-W05

Produce: Stage closure recommendation with DoD evidence.
```

---

### SMA-003 — Integration Steward

**Role:** Read-only integration governance agent

**Use when:** Reviewing integration specs, verifying read-only constraints, preparing capability matrices

```
Review integration spec for no-write-path compliance.

Inputs:
- Integration spec: [path]
- Write-back policy: 01_DOCTRINE/02_policies/WRITE_BACK_POLICY.md

Scope: Specified integration only
Context: Stage 2.1 read-only validation

Produce: No-write-path verification report and capability matrix.
```

**Note:** SMA-003 has no execution or external write authority.

---

### SMA-004 — Knowledge Curation

**Use when:** Triaging INBOX, identifying stale artifacts, proposing placements

```
Triage INBOX and propose artifact placements.

Inputs:
- INBOX: 09_INBOX/
- Folder map: 00_SYSTEM/architecture/FOLDER_MAP.md

Scope: INBOX-only
Context: Weekly cycle 2026-W05

Produce: INBOX triage report with promotion proposals.
```

---

### SMA-005 — Runbook & QA

**Use when:** Validating artifact quality, checking schemas, reviewing runbook drafts

```
Validate artifact for schema compliance.

Inputs:
- Artifact: [path]
- Schemas: 00_SYSTEM/schemas/SCHEMAS.md
- Handoff map: 01_ACTIVE_ROADMAPS/STAGE1/STAGE1.3/STAGE1.3_HANDOFF_MAP.md

Scope: Full QA validation
Context: Artifact review request

Produce: QA validation report with pass/fail and issue list.
```

---

### SMA-006 — System Librarian

**Use when:** Placing/renaming/registering system artifacts or validating index integrity

```
Place and register new doctrine + schema artifacts.

Inputs:
- Artifact payloads: [paths or inline]
- Classification: type=doctrine|schema, domain=matters, status=draft, owner=ML1
- Target action: place_and_register
- Mode: propose

Scope: Bounded to specified artifacts
Context: New canonical artifacts

Produce: Mapping + index updates + validation report + change packet.
```

---

## Standard Output Format

All agents must produce outputs using this structure:

```markdown
## Summary
- (3–5 bullets)

## Findings
1. ...
2. ...

## Recommendations
1. ...
2. ...

## Actions
- [ ] ...
- [ ] ...

## Escalations Required (if any)
- ML1 approval required because: ...

## Evidence
- file_path:line_number

## Assumptions / Confidence
- ...
```

---

## Write-Back Policy

All agents operate under `01_DOCTRINE/02_policies/WRITE_BACK_POLICY.md`:

1. **Local-first:** All work lands in repo first
2. **No external writes:** External tool writes are disallowed in Stage 2.1
3. **ML1 approval required:** External writes require explicit ML1 approval

### Allowed Write Locations by Agent

| Agent   | Allowed Locations                                  |
| ------- | -------------------------------------------------- |
| SMA-001 | Compliance reports, governance review notes        |
| SMA-002 | BACKLOG.md (within scope), planning reports        |
| SMA-003 | Integration specs (versioned), capability matrices |
| SMA-004 | Index files, triage reports                        |
| SMA-005 | QA reports, runbook drafts                         |
| SMA-006 | Canonical artifact placements, index updates, change packets |

---

## ML1 Approval Boundaries

ML1 approval is required when:

* An action would modify schemas or doctrine
* An action would enable external writes
* An action would change agent authority or scope
* An agent escalates uncertainty beyond defined rules

Canonical reference: `01_DOCTRINE/02_policies/ML1_APPROVAL_BOUNDARIES.md`

---

## Agent Versioning and Status

### Version Format

* `v<major>.<minor>`
* Major: Breaking changes to permissions or outputs
* Minor: Non-breaking enhancements

### Status Definitions

* **Draft:** Safe for analysis and reporting; write-back requires review
* **Active:** Approved for operation within defined constraints

### Current Versions

| Agent   | Version | Status |
| ------- | ------- | ------ |
| SMA-001 | v1.0    | Active |
| SMA-002 | v1.0    | Active |
| SMA-003 | v1.0    | Active |
| SMA-004 | v1.0    | Active |
| SMA-005 | v1.0    | Active |
| SMA-006 | v1.0    | Draft  |

---

## Troubleshooting

### Agent Refuses to Execute

**Cause:** Scope violation, refusal condition, or approval boundary reached

**Resolution:**

1. Check agent definition
2. Verify scope and inputs
3. Determine if ML1 approval is required
4. Escalate per governance process

### Output Format Non-Compliant

**Resolution:**

1. Re-invoke with explicit format requirement
2. Validate against standard output format
3. Request SMA-005 QA validation

### Prohibited Write Attempt

**Resolution:**

1. Stop execution
2. Review invocation context
3. Run safety rails script
4. Report to SMA-001

---

## Weekly Operating Cycle

1. Run SMA-004 INBOX scan
2. Run SMA-002 backlog update
3. Run SMA-001 compliance check (if PRs pending)
4. Run SMA-003 integration review (if applicable)
5. Run SMA-006 librarian pass (if new artifacts or index drift)
6. Run SMA-005 QA validation (if artifacts submitted)
7. Review outputs for format compliance
8. Document cycle results

### Automation (Weekly Sweep)

Run both sweeps with a single command:

```bash
python3 00_SYSTEM/scripts/run_weekly_cycle.py
```

This will:
- Run the System Admin sweep
- Run the System Management sweep
- Write a weekly cycle log under `06_RUNS/`

**Example schedule (cron):**
```bash
# Every Monday at 09:00
0 9 * * 1 cd /path/to/ll-secondbrain_fresh && python3 00_SYSTEM/scripts/run_weekly_cycle.py
```

---

## Known Gaps (Intentional)

* No autonomous cross-agent chaining
* No external writes
* No self-modifying schemas or doctrine
* No implicit authority expansion

---

## Related Documents

* Agent Definitions: `00_SYSTEM/AGENTS/`
* Write-Back Policy: `01_DOCTRINE/02_policies/WRITE_BACK_POLICY.md`
* ML1 Approval Boundaries: `01_DOCTRINE/02_policies/ML1_APPROVAL_BOUNDARIES.md`
* Folder Map: `00_SYSTEM/architecture/FOLDER_MAP.md`
* Schemas: `00_SYSTEM/schemas/SCHEMAS.md`
* Test Fixtures: `03_TESTS/fixtures/`
* Golden Outputs: `03_TESTS/golden_outputs/`
