---
id: 04_initiatives__system_portfolio__01_active_roadmaps__stage2__stage2_2__stage2_2_action_plan_md
title: Stage 2.2 — Integration Activation: Action Plan
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Stage 2.2 — Integration Activation: Action Plan

## Status

- **Status:** IN PROGRESS (Phases 2.2.1–2.2.2 complete; Phase 2.2.3 pending)
- **Owner:** ML1
- **Execution Owner:** Integration Steward Agent (SMA-003)
- **Dependencies:** Stage 2.1 Agent Runtime Setup (CLOSED)
- **Note:** Resumed 2026-02-03; Phase 2.2.3 (Word/OneDrive) pending

---

## Purpose

Activate read-only external integrations (Gmail → SharePoint → Word) in a controlled, auditable manner, ensuring:

- No write paths exist
- Credentials are securely handled
- Audit logging is implemented
- Integrations are validated before operational use

---

## Multi-Source Intake Architecture

> **The inbox tracks uncertainty, not origin. Sources feed the inbox; they do not define it.**

All integrations in Stage 2.2 are **intake sources** that feed into `09_INBOX/_sources/`:

```
External Source (Gmail/SharePoint/OneDrive)
   ↓
09_INBOX/_sources/<source>/     ← Stage 2.2 writes here
   ↓ (normalization step)
09_INBOX/00_UNTRIAGED/          ← Stage 2.3+ reads from here
```

### Source-Specific Intake Buffers

| Integration | Intake Buffer | Purpose |
|-------------|---------------|---------|
| Gmail | `09_INBOX/_sources/gmail/` | Email metadata, message extracts |
| SharePoint | `09_INBOX/_sources/sharepoint/` | Document snapshots, metadata |
| OneDrive/Word | `09_INBOX/_sources/drive/` | Document content, read-only extracts |

### Key Principles

1. **Source ≠ Status** — All sources are treated equally after normalization
2. **No source bypasses inbox** — SharePoint, Gmail, Drive all enter through `_sources/`
3. **Mechanical buffers only** — `_sources/` folders may reflect quirks of origin systems
4. **Decisions happen after normalization** — Classification is source-agnostic

---

## Scope

### Authorized

Stage 2.2 is authorized to:

- Configure OAuth / API access for external systems
- Use read-only scopes exclusively
- Store credentials in local `.env` files (excluded from git)
- Implement and test audit logging
- Produce verification reports

### Not Authorized

Stage 2.2 is **not** authorized to:

- Enable write-back or mutation capabilities
- Access matter/client-specific data
- Automate polling or background jobs
- Modify doctrine or operating rules

---

## Binding Inputs

### Integration Specifications (Stage 1.2)

Located at: `10_ARCHIVE/INITIATIVES/SYSTEM_PORTFOLIO/STAGE1/STAGE1.2/`

| Spec | Purpose |
|------|---------|
| STAGE2_GMAIL_READ_ONLY_SPEC.md | Gmail integration requirements |
| STAGE2_SHAREPOINT_READ_ONLY_SPEC.md | SharePoint integration requirements |
| STAGE2_WORD_READ_ONLY_SPEC.md | Word/OneDrive integration requirements |
| STAGE2_AUDIT_LOGGING_EXPECTATIONS.md | Audit logging requirements |
| STAGE2_NO_WRITE_PATH_REVIEW.md | No-write-path verification criteria |

### Agent Authority

| Agent | Role |
|-------|------|
| SMA-003 Integration Steward | Primary executor |
| SMA-001 System Governance | Compliance validation |
| SMA-005 Runbook & QA | QA and schema checks |
| ML1 | Approval and escalation authority |

---

## Workstreams & Action Items

### Workstream B1 — Google Workspace Integration (Phase 2.2.1) ✅ COMPLETE

**Owner:** SMA-003 Integration Steward

**Steps:**

1. [x] Create or select Google Cloud project
2. [x] Configure OAuth consent screen
   - User type: internal (if applicable)
   - Scopes: Gmail read-only, Calendar read-only
3. [x] Generate OAuth credentials
4. [x] Store credentials in `.env` (not committed)
5. [x] Implement audit logging per Stage 1.2
6. [x] Test read-only access
7. [x] Verify no-write-path compliance
8. [x] Produce integration status + compliance report

**Deliverables:**

- Gmail integration configuration (read-only)
- Audit logging confirmation
- No-write-path verification report

---

### Workstream B2 — SharePoint Integration (Phase 2.2.2) ✅ COMPLETE

**Owner:** SMA-003 Integration Steward
**Dependency:** Completion of Phase 2.2.1

**Steps:**

1. [x] Register Azure AD application
2. [x] Configure Microsoft Graph permissions
   - SharePoint read-only scopes only
3. [x] Generate client credentials
4. [x] Store credentials in `.env`
5. [x] Implement audit logging
6. [x] Test read-only SharePoint access
7. [x] Verify no-write-path compliance
8. [x] Produce integration status + compliance report

**Deliverables:**

- SharePoint integration configuration (read-only)
- Audit logging confirmation
- No-write-path verification report

---

### Workstream B3 — Word / OneDrive Integration (Phase 2.2.3)

**Owner:** SMA-003 Integration Steward
**Dependency:** Completion of Phase 2.2.2

**Steps:**

1. [ ] Enable Word / OneDrive read-only access via Graph
2. [ ] Confirm document-level read-only permissions
3. [ ] Validate no document mutation paths
4. [ ] Implement audit logging
5. [ ] Test read-only document access
6. [ ] Produce integration status + compliance report

**Deliverables:**

- Word/OneDrive integration configuration (read-only)
- Audit logging confirmation
- No-write-path verification report

---

## Governance & QA Checks (Mandatory)

### System Governance (SMA-001)

- Validate declared scopes vs specs
- Confirm no write permissions granted
- Review placement and documentation of artifacts
- Issue pass/fail compliance determination

### Runbook & QA (SMA-005)

- Validate reports against standard output format
- Confirm schema and required sections
- Flag gaps or inconsistencies

---

## Definition of Done (Stage 2.2)

Stage 2.2 is complete when:

- [x] Gmail read-only integration active and verified
- [x] SharePoint read-only integration active and verified
- [ ] Word/OneDrive read-only integration active and verified
- [ ] Audit logging implemented for all integrations
- [ ] No-write-path verification completed and documented
- [ ] SMA-001 compliance reports issued (pass)
- [ ] SMA-005 QA validation completed (pass)

---

## Outputs

All outputs must follow the Standard Output Format and be stored in approved locations:

| Output | Location |
|--------|----------|
| Integration configuration summaries | `03_TESTS/agent_outputs/` or designated |
| Audit logging confirmation reports | `03_TESTS/agent_outputs/` or designated |
| No-write-path verification reports | `03_TESTS/agent_outputs/` or designated |
| Governance compliance reports | `03_TESTS/agent_outputs/` or designated |
| QA validation reports | `03_TESTS/agent_outputs/` or designated |

---

## Risks & Controls

| Risk | Likelihood | Impact | Control |
|------|------------|--------|---------|
| OAuth scope creep | Low | High | Explicit scope review + SMA-001 validation |
| Credential exposure | Low | Critical | `.env` only, gitignored, safety rails |
| Undetected write path | Low | High | Explicit no-write-path testing + reports |
| Integration drift | Low | Medium | Specs are binding; changes escalated to ML1 |

---

## Execution Tracking

### Phase 2.2.1: Google Workspace Integration ✅ COMPLETE

#### Gmail
| Item | Status | Date | Notes |
|------|--------|------|-------|
| Google Cloud project | ✅ done | 2026-01-28 | Project configured |
| OAuth consent screen | ✅ done | 2026-01-28 | Read-only scope only |
| Credentials generated | ✅ done | 2026-01-28 | .env populated, refresh token obtained |
| Audit logging | ✅ done | 2026-01-28 | 00_SYSTEM/scripts/gmail_integration.py, logs/gmail_audit.log |
| Read-only test | ✅ done | 2026-01-28 | Connected as matthew@levinelegal.ca |
| No-write-path verification | ✅ done | 2026-01-28 | GMAIL_NO_WRITE_PATH_VERIFICATION.md |
| Compliance report | ✅ done | 2026-01-28 | GMAIL_INTEGRATION_COMPLIANCE_REPORT.md |

#### Google Calendar
| Item | Status | Date | Notes |
|------|--------|------|-------|
| Calendar API enabled | ✅ done | 2026-02-02 | Same GCP project as Gmail |
| Read-only scope | ✅ done | 2026-02-02 | calendar.readonly scope |
| Credentials generated | ✅ done | 2026-02-02 | Shared OAuth with Gmail |
| Read-only test | ✅ done | 2026-02-02 | Connected to primary calendar |

### Phase 2.2.2: SharePoint Integration ✅ COMPLETE
| Item | Status | Date | Notes |
|------|--------|------|-------|
| Azure AD application | ✅ done | 2026-02-03 | Microsoft Entra app registration complete |
| Graph permissions | ✅ done | 2026-02-03 | Read-only scopes only |
| Credentials generated | ✅ done | 2026-02-03 | .env populated, credentials validated |
| Audit logging | ✅ done | 2026-02-03 | Audit scaffolding in place |
| Read-only test | ✅ done | 2026-02-03 | Dry-run EXIT=0, 00_SYSTEM/scripts/sharepoint_integration.py |
| No-write-path verification | ✅ done | 2026-02-03 | Read-only guarantees preserved |
| State/metadata scaffolding | ✅ done | 2026-02-03 | state/, raw/, metadata/ directories ready |

### Phase 2.2.3: Word/OneDrive Integration
| Item | Status | Date | Notes |
|------|--------|------|-------|
| Graph access enabled | ⬜ pending | | |
| Document permissions | ⬜ pending | | |
| Audit logging | ⬜ pending | | |
| Read-only test | ⬜ pending | | |
| No-write-path verification | ⬜ pending | | |
| Compliance report | ⬜ pending | | |

---

## References

- Stage 2 Authorization: `01_ACTIVE_ROADMAPS/STAGE2/STAGE2_AUTHORIZATION_KICKOFF.md`
- Write-Back Policy: `01_DOCTRINE/02_policies/WRITE_BACK_POLICY.md`
- ML1 Approval Boundaries: `01_DOCTRINE/02_policies/ML1_APPROVAL_BOUNDARIES.md`
- Credential Inventory: `00_SYSTEM/security/CREDENTIAL_INVENTORY.md`
- Agent Deployment Guide: `00_SYSTEM/agents/deployment/AGENT_DEPLOYMENT_GUIDE.md`
- **Multi-Source Inbox Architecture: `09_INBOX/README.md`**
