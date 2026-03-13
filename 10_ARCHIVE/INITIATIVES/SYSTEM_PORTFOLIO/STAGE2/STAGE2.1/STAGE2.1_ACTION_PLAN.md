---
id: 10_archive__initiatives__system_portfolio__stage2__stage2_1__stage2_1_action_plan_md
title: Stage 2.1 — Agent Runtime Setup: Action Plan (Amended v2)
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Stage 2.1 — Agent Runtime Setup: Action Plan (Amended v2)

## Overview
Deploy 5 system-level agents using Claude Code as the runtime.

**Status:** ✅ COMPLETE (2026-01-31 — status corrected per Stage 2.8 audit)
**Owner:** ML1 + Runbook & QA Agent
**Target:** All 5 agents operational and tested

---

## Prerequisites

### Decisions Resolved ✅
- [x] Runtime: Claude Code agents
- [x] Credential storage: Environment variables (`.env`)
- [x] Integration order: Gmail → SharePoint → Word

### Dependencies
- Stage 1.3 Agent Roster: `01_ACTIVE_ROADMAPS/STAGE1/STAGE1.3/STAGE1.3_AGENT_ROSTER.md`
- Stage 1.3 Runbooks: `01_ACTIVE_ROADMAPS/STAGE1/STAGE1.3/STAGE1.3_RUNBOOK_*.md`
- Stage 1.3 Handoff Map: `01_ACTIVE_ROADMAPS/STAGE1/STAGE1.3/STAGE1.3_HANDOFF_MAP.md`

---

## Action Items

### Phase 0: Repo Structure & Safety Rails (NEW)

#### 0.1 Normalize stage folder naming
- [ ] Rename stage folders to 1.1/1.2/1.3/1.4 format

**Deliverable:** Stage folder structure normalized

#### 0.2 Add repo safety rails (NEW)
- [ ] Add lightweight checks (script or pre-commit) to validate:
  - `.env` is not tracked/committed
  - agent outputs only written to allowed folders (per agent contract)
  - required frontmatter/required sections present for designated artifact types

**Deliverable:** Repo safety rail checks committed and runnable locally

---

### Phase 1: Environment Setup

#### 1.1 Create credential infrastructure
- [ ] **Create `.env.example` template** — Document required variables (no secrets)
- [ ] **Add `.env` to `.gitignore`** — Ensure secrets never committed
- [ ] **Create local `.env` file** — ML1 populates with actual credentials
- [ ] **Document credential locations** — Where each credential comes from

**Deliverable:** `.env.example` file with comments explaining each variable

#### 1.2 Create agent configuration directory (AMENDED)
- [ ] **Create `00_SYSTEM/agents/` directory** — Canonical home for agent definitions
- [ ] **Create agent definition templates** — One per agent, based on runbooks
- [ ] **Document invocation patterns** — How to call each agent
- [ ] **Add per-agent contract sections (NEW)** — Inputs/Outputs/Permissions/Prohibitions/Refusals

**Deliverable:** Agent definition files in `00_SYSTEM/agents/`

---

### Phase 2: Agent Deployment

#### Required Agent Definition Schema (NEW)

Each agent definition file MUST include:

| Section | Description |
|---------|-------------|
| **Agent Identifier** | e.g., SYS-005 |
| **Version** | e.g., v0.1 |
| **Derived From** | runbook path(s) |
| **Authority Scope** | Read permissions, Write permissions (explicit allowlist), Explicit prohibitions |
| **Inputs** | required files/paths/parameters |
| **Outputs** | artifact types + required structure |
| **Invocation Pattern** | example commands/usage |
| **Refusal Conditions** | when to stop/escalate |

#### Standard Agent Output Format (NEW)

All agent-produced artifacts/reports MUST use this structure:

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

## Evidence
- file_path:line_number
- ...

## Assumptions / Confidence
- ...
```

---

#### 2.1 System Governance Agent (SYS-005)
**Purpose:** Enforce system rules, validate compliance, review changes

**Setup Steps:**
- [ ] Create `00_SYSTEM/agents/specs/system_management/SMA_SYSTEM_GOVERNANCE.md`
- [ ] Define agent prompt based on `STAGE3_RUNBOOK_SYSTEM_GOVERNANCE.md`
- [ ] Include required agent definition schema sections
- [ ] Test: Agent validates a PR for governance compliance
- [ ] Test: Agent produces compliance checklist (standard output format)
- [ ] Test: Agent detects a rule/runbook collision and outputs a collision report with options (NEW)
- [ ] Document invocation example

**Test Criteria:**
- Can read repository files
- Can identify folder placement violations
- Can detect collisions between runbooks/artifacts (NEW)
- Produces structured compliance report (standard output format)

---

#### 2.2 Portfolio Planning Agent (SYS-006)
**Purpose:** Manage roadmap sequencing, backlog, stage transitions

**Setup Steps:**
- [ ] Create `00_SYSTEM/agents/specs/system_management/SMA_PORTFOLIO_PLANNING.md`
- [ ] Define agent prompt based on `STAGE3_RUNBOOK_PORTFOLIO_PLANNING.md`
- [ ] Include required agent definition schema sections
- [ ] Test: Agent reviews backlog and proposes prioritization (standard output format)
- [ ] Test: Agent prepares stage closure summary referencing DoD criteria used (NEW)
- [ ] Document invocation example

**Test Criteria:**
- Can read and update backlog
- Can track stage completion against DoD (and cite which criteria) (NEW)
- Produces sequencing proposals (standard output format)

---

#### 2.3 Integration Steward Agent (SYS-007)
**Purpose:** Manage read-only integration specs and access

**Setup Steps:**
- [ ] Create `00_SYSTEM/agents/specs/system_management/SMA_INTEGRATION_STEWARD.md`
- [ ] Define agent prompt based on `STAGE3_RUNBOOK_INTEGRATION_STEWARD.md`
- [ ] Include required agent definition schema sections
- [ ] Test: Agent reviews integration spec for compliance
- [ ] Test: Agent validates no-write-path requirements
- [ ] Test: Agent produces a capability matrix (integration → read/write → auth method → approved scopes) (NEW)
- [ ] Document invocation example

**Test Criteria:**
- Can read integration specs
- Can verify read-only constraints
- Produces integration status reports and capability matrix (NEW)

---

#### 2.4 Knowledge Curation Agent (SYS-008)
**Purpose:** Organize, index, maintain system knowledge

**Setup Steps:**
- [ ] Create `00_SYSTEM/agents/specs/system_management/SMA_KNOWLEDGE_CURATION.md`
- [ ] Define agent prompt based on `STAGE3_RUNBOOK_KNOWLEDGE_CURATION.md`
- [ ] Include required agent definition schema sections
- [ ] Test: Agent scans INBOX and proposes triage (standard output format)
- [ ] Test: Agent identifies stale artifacts
- [ ] Test: Agent applies explicit promotion criteria checklist for INBOX → canonical (NEW)
- [ ] Document invocation example

**Test Criteria:**
- Can scan folder structure
- Can identify misplaced artifacts
- Produces triage recommendations with promotion criteria evidence (NEW)

---

#### 2.5 Runbook & QA Agent (SYS-009)
**Purpose:** Draft runbooks, validate artifact quality

**Setup Steps:**
- [ ] Create `00_SYSTEM/agents/specs/system_management/SMA_RUNBOOK_QA.md`
- [ ] Define agent prompt based on `STAGE3_RUNBOOK_QA.md`
- [ ] Include required agent definition schema sections
- [ ] Test: Agent validates YAML frontmatter
- [ ] Test: Agent checks required sections
- [ ] Test: Agent validates agent-definition schema sections exist (NEW)
- [ ] Test: Agent validates standard output format sections exist (NEW)
- [ ] Document invocation example

**Test Criteria:**
- Can validate YAML frontmatter
- Can check required sections
- Can validate agent contract sections + output format compliance (NEW)
- Produces QA validation reports (standard output format)

---

### Phase 2.6: System Write-Back Policy (NEW)

- [ ] Define and document system write-back rules:
  - **Local-first:** agent work lands in repo first
  - **External tool writes are disallowed** in Stage 2.1 (read-only only)
  - **External writes require ML1 approval**, change summary, and rollback plan (to be activated in later stage)
- [ ] Add policy reference into each agent's Authority Scope section

**Deliverable:** `01_DOCTRINE/02_policies/WRITE_BACK_POLICY.md` (or equivalent) and agent files updated to reference it

---

### Phase 2.7: Test Fixtures & Golden Outputs (NEW)

- [ ] Create `03_TESTS/fixtures/` with:
  - example misplaced artifact
  - example stale artifact
  - example conflicting rules/runbooks scenario
  - example "PR-like" change set
- [ ] Create `03_TESTS/golden_outputs/` with:
  - expected governance compliance report
  - expected QA report
  - expected backlog prioritization output

**Deliverable:** Repeatable fixtures + baseline outputs committed

---

### Phase 3: Testing

#### 3.1 Handoff test
- [ ] **Test handoff: Portfolio Planning → System Governance**
  - Portfolio Planning prepares closure recommendation (standard output format)
  - System Governance validates compliance (standard output format)
  - Validate output placement compliance (NEW)
- [ ] **Test handoff: Knowledge Curation → System Governance**
  - Knowledge Curation proposes artifact promotion with promotion criteria checklist (NEW)
  - System Governance validates placement
  - Validate output placement compliance (NEW)
- [ ] **Test handoff: Runbook & QA → System Governance (NEW)**
  - QA flags issues
  - Governance issues pass/fail + remediation checklist

#### 3.2 Failure-mode test (NEW)
- [ ] Force an agent attempt to write outside its allowed folders
- [ ] Confirm runtime or governance checks block/flag the attempt
- [ ] Record evidence and remediation guidance

#### 3.3 End-to-end test
- [ ] **Simulate weekly cycle (dry run)**
  - INBOX scan by Knowledge Curation
  - Backlog update by Portfolio Planning
  - Compliance check by System Governance
  - QA validation by Runbook & QA
- [ ] Document results and gaps
- [ ] Validate all outputs conform to standard output format (NEW)

---

### Phase 4: Documentation

#### 4.1 Agent deployment guide
- [ ] Create `00_SYSTEM/agents/deployment/AGENT_DEPLOYMENT_GUIDE.md`
- [ ] Document how to invoke each agent
- [ ] Include troubleshooting section
- [ ] Include agent definition vs playbook distinction (NEW)
- [ ] Include agent versioning and update procedure (NEW)
- [ ] Include write-back policy summary (NEW)

#### 4.2 Credential documentation
- [ ] Document credential inventory (names, sources, not values)
- [ ] Document rotation procedures

---

## Environment Variables Template

```bash
# .env.example — Copy to .env and fill in values

# === Repository Access ===
# (Claude Code has native repo access, no token needed)

# === Gmail Integration (Stage 2.2) ===
# GMAIL_CLIENT_ID=
# GMAIL_CLIENT_SECRET=
# GMAIL_REFRESH_TOKEN=

# === Microsoft Graph Integration (Stage 2.2) ===
# AZURE_CLIENT_ID=
# AZURE_CLIENT_SECRET=
# AZURE_TENANT_ID=

# === Agent Configuration ===
# CLAUDE_MODEL=claude-sonnet-4-20250514
```

---

## Success Criteria (AMENDED)

| Criterion | Measure |
|-----------|---------|
| All 5 agents defined | Agent files exist in `00_SYSTEM/agents/` |
| All 5 agents tested | Each produces at least one artifact using standard output format |
| Agent contracts present | Each agent file includes the required agent definition schema sections |
| Handoffs work | At least one handoff test passes and outputs are in allowed folders |
| Failure-mode caught | Out-of-bounds write attempt is blocked/flagged and documented |
| Documentation complete | Deployment guide + credential inventory + write-back policy exist |

---

## Execution Tracking

### Phase 0: Repo Structure & Safety Rails
| Item | Status | Date | Notes |
|------|--------|------|-------|
| 0.1 Normalize folders | ✅ done | 2026-01-27 | STAGE1.1/1.2/1.3/1.4/STAGE2 structure |
| 0.2 Safety rails | ✅ done | 2026-01-27 | scripts/safety-rails.sh |

### Phase 1: Environment Setup
| Item | Status | Date | Notes |
|------|--------|------|-------|
| 1.1 Credential infra | ✅ done | 2026-01-27 | .env.example + .gitignore created |
| 1.2 Agent directory | ✅ done | 2026-01-27 | 00_SYSTEM/agents/ created |

### Phase 2: Agent Deployment
| Agent | Definition | Tests Pass | Notes |
|-------|------------|------------|-------|
| SYS-005 System Governance | ✅ | ✅ | v0.1 DRAFT |
| SYS-006 Portfolio Planning | ✅ | ✅ | v0.1 DRAFT |
| SYS-007 Integration Steward | ✅ | ✅ | v0.1 DRAFT |
| SYS-008 Knowledge Curation | ✅ | ✅ | v0.1 DRAFT |
| SYS-009 Runbook & QA | ✅ | ✅ | v0.1 DRAFT |
| 2.6 Write-Back Policy | ✅ | — | 01_DOCTRINE/02_policies/WRITE_BACK_POLICY.md |
| 2.7 Test Fixtures | ✅ | — | 03_TESTS/fixtures + golden_outputs |

### Phase 3: Testing
| Item | Status | Date | Notes |
|------|--------|------|-------|
| 3.1 Handoff tests | ✅ done | 2026-01-27 | 03_TESTS/agent_outputs/PHASE3.1_HANDOFF_TEST_RESULTS.md |
| 3.2 Failure-mode test | ✅ done | 2026-01-27 | 03_TESTS/agent_outputs/PHASE3.2_FAILURE_MODE_TEST.md |
| 3.3 End-to-end test | ✅ done | 2026-01-27 | 03_TESTS/agent_outputs/PHASE3.3_E2E_TEST_RESULTS.md |

### Phase 4: Documentation
| Item | Status | Date | Notes |
|------|--------|------|-------|
| 4.1 Deployment guide | ✅ done | 2026-01-27 | 00_SYSTEM/agents/deployment/AGENT_DEPLOYMENT_GUIDE.md |
| 4.2 Credential docs | ✅ done | 2026-01-27 | 00_SYSTEM/security/CREDENTIAL_INVENTORY.md |
