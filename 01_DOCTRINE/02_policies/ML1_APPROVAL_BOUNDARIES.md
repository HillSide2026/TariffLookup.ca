---
id: 00_system__ml1_approval_boundaries_md
title: ML1 Approval Boundaries
owner: ML1
status: draft
version: 1.0
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# ML1 Approval Boundaries

**Version:** 1.0
**Last Updated:** 2026-01-27
**Status:** Active
**Authority:** ML1 (Matthew Levine)

---

## Purpose

This document defines the explicit boundaries where ML1 (human) approval is required before agents or the system may proceed. It serves as the canonical reference for escalation triggers.

---

## Core Principle

**Agents propose. ML1 decides.**

All agent outputs are recommendations until ML1 approval is granted. No agent action may cross the boundaries defined in this document without explicit ML1 sign-off.

---

## Approval Required: Doctrine & Schema

| Action | Requires ML1 Approval |
|--------|----------------------|
| Create new doctrine document | **YES** |
| Modify existing doctrine | **YES** |
| Promote artifact to BINDING status | **YES** |
| Modify `00_SYSTEM/schemas/SCHEMAS.md` | **YES** |
| Modify `00_SYSTEM/architecture/FOLDER_MAP.md` | **YES** |
| Modify this document | **YES** |

---

## Approval Required: Agent Authority

| Action | Requires ML1 Approval |
|--------|----------------------|
| Promote agent from Draft to Active | **YES** |
| Modify agent authority scope | **YES** |
| Add new agent to roster | **YES** |
| Remove agent from roster | **YES** |
| Change agent refusal conditions | **YES** |
| Expand agent write permissions | **YES** |

---

## Approval Required: External Actions

| Action | Requires ML1 Approval |
|--------|----------------------|
| Enable external writes (any integration) | **YES** |
| Create or store credentials | **YES** |
| Activate integrations (Gmail, SharePoint, Word) | **YES** |
| Execute runbooks in production | **YES** |
| Push changes to remote repository | **YES** |
| Create pull requests | **YES** |

---

## Approval Required: Stage Lifecycle

| Action | Requires ML1 Approval |
|--------|----------------------|
| Close a stage | **YES** |
| Archive stage artifacts | **YES** |
| Promote roadmap to Active | **YES** |
| Skip or waive DoD requirements | **YES** |
| Start new stage | **YES** |

---

## Approval NOT Required (Agent Autonomy)

Agents may proceed autonomously for:

| Action | ML1 Approval |
|--------|-------------|
| Read any repository file | No |
| Produce reports in standard output format | No |
| Propose artifact placements | No |
| Flag compliance issues | No |
| Update BACKLOG.md (within defined scope) | No |
| Create test outputs in `03_TESTS/agent_outputs/` | No |
| Draft runbooks (clearly marked as Draft) | No |
| Update index files (per FOLDER_MAP) | No |

---

## Escalation Triggers

Agents MUST escalate to ML1 when:

1. **Uncertainty exceeds defined rules** — No clear doctrine or schema guidance
2. **Conflict detected** — Two rules or artifacts contradict each other
3. **Authority boundary reached** — Action would cross approval boundary
4. **Refusal condition triggered** — Agent cannot proceed per its definition
5. **External system interaction required** — Any non-local action

---

## Escalation Format

When escalating, agents must include:

```markdown
## Escalation Required

**Agent:** [Agent ID]
**Action Requested:** [What the agent was asked to do]
**Boundary Reached:** [Which approval boundary applies]
**Options:**
1. [Option A with implications]
2. [Option B with implications]
3. [Decline/defer]

**Recommendation:** [Agent's recommendation, if any]
**Evidence:** [file_path:line_number references]
```

---

## Approval Record

ML1 approvals should be recorded in the relevant artifact or closure document with:

- Date
- Decision (Approved / Denied / Deferred)
- Scope of approval
- Any conditions or constraints

---

## Cross-References

- Agent Deployment Guide: `00_SYSTEM/agents/deployment/AGENT_DEPLOYMENT_GUIDE.md`
- Write-Back Policy: `01_DOCTRINE/02_policies/WRITE_BACK_POLICY.md`
- Agent Definitions: `00_SYSTEM/AGENTS/`
- Doctrine: `01_DOCTRINE/`

---

## Amendment Process

This document may only be modified by ML1. Changes require:

1. Clear rationale documented
2. Impact assessment on existing agent definitions
3. Version increment
4. Date update
