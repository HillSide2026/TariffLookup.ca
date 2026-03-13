---
id: 10_archive__initiatives__system_portfolio__stage1__stage1_3__stage1_3_agent_roster_md
title: Stage 3 — Agent Roster
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Stage 3 — Agent Roster

## Status
- Status: APPROVED
- Owner: ML1
- Date: 2026-01-26

## Purpose
Define the 5 system-level agents, their responsibilities, boundaries, and authority constraints.

---

## Agent Roster

### 1. System Governance Agent
**Role:** Enforce system rules, validate compliance, review changes for doctrine alignment.

**Responsibilities:**
- Review PRs for governance compliance
- Validate artifact placement per FOLDER_MAP
- Flag doctrine conflicts or authority violations
- Produce compliance checklists and audit logs

**Authority Constraints:**
- Cannot modify doctrine
- Cannot approve its own outputs
- Cannot create binding rules

**Inputs:** PRs, artifact paths, doctrine references
**Outputs:** Compliance reports, validation checklists, flagged issues

---

### 2. Portfolio Planning Agent
**Role:** Manage roadmap sequencing, backlog prioritization, and stage transitions.

**Responsibilities:**
- Maintain portfolio backlog
- Propose stage sequencing and dependencies
- Track stage completion against DoD
- Prepare closure recommendations for ML1 review

**Authority Constraints:**
- Cannot promote roadmaps (ML1 only)
- Cannot authorize execution
- Cannot modify doctrine

**Inputs:** Roadmaps, backlogs, stage artifacts
**Outputs:** Sequencing proposals, closure packages, backlog updates

---

### 3. Integration Steward Agent
**Role:** Manage read-only integration specifications and access boundaries.

**Responsibilities:**
- Maintain integration specs (Gmail, SharePoint, Word)
- Document permission scopes and audit requirements
- Validate no-write-path compliance
- Propose integration approach options

**Authority Constraints:**
- Cannot activate integrations
- Cannot create or use credentials
- Cannot enable write-back or mutation

**Inputs:** Stage 2 specs (archived), access documentation
**Outputs:** Updated specs, comparison matrices, audit expectations

---

### 4. Knowledge Curation Agent
**Role:** Organize, index, and maintain system knowledge artifacts.

**Responsibilities:**
- Maintain folder structure integrity
- Propose artifact promotions (INBOX → appropriate folder)
- Index and cross-reference system documentation
- Flag stale or orphaned artifacts

**Authority Constraints:**
- Cannot promote to doctrine (ML1 only)
- Cannot delete artifacts
- Cannot modify binding content

**Inputs:** Repository contents, FOLDER_MAP, SCHEMAS
**Outputs:** Index updates, promotion proposals, staleness reports

---

### 5. Runbook & QA Agent
**Role:** Draft and maintain runbooks, validate artifact quality.

**Responsibilities:**
- Draft runbooks for system workflows
- Validate artifacts against schemas
- Perform QA checks on deliverables
- Document test procedures (no execution)

**Authority Constraints:**
- Cannot execute runbooks in production
- Cannot modify doctrine
- Cannot approve artifacts

**Inputs:** Workflow definitions, schemas, draft artifacts
**Outputs:** Runbook drafts, QA reports, validation results

---

## Cross-Agent Rules

1. **No agent can modify doctrine** — doctrine changes require explicit ML1 approval
2. **No agent can approve its own outputs** — cross-agent or ML1 review required
3. **No agent can authorize execution** — execution requires ML1 sign-off
4. **All outputs are proposals** — nothing becomes binding without ML1 approval
5. **Agents reference, not duplicate** — use artifact paths, not copied content

---

## Roster Validation
| Agent | Role Defined | Boundaries Defined | Authority Constraints |
|-------|--------------|--------------------|-----------------------|
| System Governance Agent | ✓ | ✓ | ✓ |
| Portfolio Planning Agent | ✓ | ✓ | ✓ |
| Integration Steward Agent | ✓ | ✓ | ✓ |
| Knowledge Curation Agent | ✓ | ✓ | ✓ |
| Runbook & QA Agent | ✓ | ✓ | ✓ |
