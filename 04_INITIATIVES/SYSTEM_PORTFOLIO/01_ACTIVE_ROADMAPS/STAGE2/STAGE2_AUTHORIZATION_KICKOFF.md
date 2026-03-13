---
id: 04_initiatives__system_portfolio__01_active_roadmaps__stage2__stage2_authorization_kickoff_md
title: Stage 2 — Implementation & Operations: Authorization & Kickoff
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Stage 2 — Implementation & Operations: Authorization & Kickoff

## Status
- Status: APPROVED
- Owner: ML1
- Date: 2026-01-26
- Approved: 2026-01-26

## Purpose
Authorize implementation of system-level agents and read-only integrations.
This is the first stage that builds actual running infrastructure.

## Mapping to Roadmap
This kickoff covers **Stage 2** of the roadmap, which includes:
- **2.1 Agent Runtime Setup** — Deploy Claude Code agents
- **2.2 Integration Activation** — Gmail → SharePoint → Word
- **2.3 Operational Validation** — First operating cycle

## Preconditions ✅
- [x] Stage 1.3 (Agent Orchestration) complete with agent roster and runbooks
- [x] Stage 1.4 (Operating Rhythm) complete with cadence and governance rules
- [x] Roadmap promoted to ACTIVE status
- [x] ML1 decisions resolved (runtime, credentials, integration order)

## Resolved Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Agent Runtime** | Claude Code agents | Native integration, familiar subprocess model |
| **Credential Storage** | Environment variables | Simple start, upgrade later if needed |
| **Integration Order** | Gmail → SharePoint → Word | Gmail first per ML1 preference |

---

## Authorized Scope (Stage 2)

### 2.1 Agent Runtime Setup
Stage 2.1 is authorized to:
- Configure Claude Code agent invocations
- Create agent prompt templates per runbooks
- Deploy all 5 system-level agents
- Test agent execution against runbooks
- Store credentials in `.env` file (excluded from git)

### 2.2 Integration Activation
Stage 2.2 is authorized to:
- Create OAuth application for Gmail API (read-only scopes only)
- Configure Microsoft Graph API for SharePoint (read-only)
- Configure OneDrive/Word document access (read-only)
- Implement audit logging per Stage 1.2 specifications
- Verify no write paths exist

### 2.3 Operational Validation
Stage 2.3 is authorized to:
- Execute first weekly operating cycle
- Collect metrics baseline
- Adjust cadence based on learnings

---

## Not Authorized (Stage 2)
Explicitly prohibited:
- **Write operations** — No creating, updating, or deleting data in external systems
- **Matter data access** — No accessing client/matter-specific content
- **Automated scheduling** — No cron jobs, polling, or background automation
- **Doctrine changes** — No modifications to system doctrine
- **Production client use** — Testing only, no live client workflows

---

## Binding Inputs

### From Stage 1.2 (Integration Specs)
Located at `10_ARCHIVE/INITIATIVES/SYSTEM_PORTFOLIO/STAGE1/STAGE1.2/`:
- STAGE2_GMAIL_READ_ONLY_SPEC.md
- STAGE2_SHAREPOINT_READ_ONLY_SPEC.md
- STAGE2_WORD_READ_ONLY_SPEC.md
- STAGE2_AUDIT_LOGGING_EXPECTATIONS.md
- STAGE2_NO_WRITE_PATH_REVIEW.md

### From Stage 1.3 (Agent Definitions)
Located at `01_ACTIVE_ROADMAPS/STAGE1/STAGE1.3/`:
- STAGE1.3_AGENT_ROSTER.md — 5 agent definitions
- STAGE1.3_HANDOFF_MAP.md — Agent interactions
- STAGE1.3_RUNBOOK_*.md — 5 agent runbooks

### From Stage 1.4 (Operating Rules)
Located at `01_ACTIVE_ROADMAPS/STAGE1/STAGE1.4/`:
- STAGE1.4_OPERATING_CADENCE.md
- STAGE1.4_AUDIT_CHECKLIST.md

---

## Definition of Done (DoD)

### 2.1 Agent Runtime ✅ COMPLETE (2026-01-27)
- [x] Agent runtime selected: **Claude Code agents**
- [x] System Governance Agent deployed and tested (SMA-001) — v1.0 Active
- [x] Portfolio Planning Agent deployed and tested (SMA-002) — v1.0 Active
- [x] Integration Steward Agent deployed and tested (SMA-003) — v1.0 Active
- [x] Knowledge Curation Agent deployed and tested (SMA-004) — v1.0 Active
- [x] Runbook & QA Agent deployed and tested (SMA-005) — v1.0 Active

### 2.2 Integration Activation criteria
- [ ] Gmail read-only integration active (SYS-002)
- [ ] SharePoint read-only integration active (SYS-003)
- [ ] Word/OneDrive read-only integration active (SYS-004)
- [ ] No-write-path verification completed

### 2.3 Operational Validation criteria
- [ ] First operating cycle completed (SYS-010)
- [ ] Metrics baseline established
- [ ] Stage 1 artifacts archived (SYS-011)
- [ ] System declared operational

---

## Workstreams

### Workstream A: Agent Deployment (2.1)
**Owner:** Runbook & QA Agent
**Sequence:**
1. Create `.env` template for credentials
2. Create agent prompt templates
3. Deploy and test each agent against runbooks
4. Document deployment guide

### Workstream B: Gmail Integration (2.2 - first)
**Owner:** Integration Steward Agent
**Sequence:**
1. Create Google Cloud project (if needed)
2. Configure OAuth consent screen (read-only)
3. Generate credentials, store in `.env`
4. Test read access, verify no write paths
5. Implement audit logging

### Workstream C: SharePoint/Word Integration (2.2 - after Gmail)
**Owner:** Integration Steward Agent
**Sequence:**
1. Register Azure AD application
2. Configure Graph API permissions (read-only)
3. Generate credentials, store in `.env`
4. Test read access, verify no write paths
5. Implement audit logging

### Workstream D: Validation (2.3)
**Owner:** All Agents
**Sequence:**
1. Execute first weekly cycle
2. Collect metrics per STAGE3_METRICS_AND_CADENCE.md
3. Review and adjust
4. Prepare closure recommendation

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| API rate limits | Medium | Medium | Implement backoff, document limits |
| OAuth scope creep | Low | High | Strict scope review, no write permissions |
| Credential exposure | Low | Critical | No secrets in repo, `.env` in `.gitignore` |
| Agent role confusion | Medium | Medium | Test against runbooks before deployment |

---

## Sign-Off
- ML1: **APPROVED**  Date: **2026-01-26**
