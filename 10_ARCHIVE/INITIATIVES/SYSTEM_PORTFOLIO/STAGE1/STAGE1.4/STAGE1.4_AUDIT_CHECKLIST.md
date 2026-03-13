---
id: 10_archive__initiatives__system_portfolio__stage1__stage1_4__stage1_4_audit_checklist_md
title: Stage 1.4 — Audit Checklist
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-11
tags: []
---

# Stage 1.4 — Audit Checklist

## Status
- Status: APPROVED
- Owner: System Governance Agent
- Date: 2026-01-26

## Purpose
Provide a minimal compliance checklist for ongoing system portfolio audits.

---

## Audit Scope

This checklist covers:
- Structural compliance (folder placement, naming)
- Governance compliance (authority boundaries, doctrine alignment)
- Operational compliance (cadence adherence, backlog hygiene)

---

## Structural Compliance

| Check | Criteria | Pass/Fail |
|-------|----------|-----------|
| **Folder Placement** | All artifacts in correct folders per FOLDER_MAP.md | |
| **Naming Convention** | Files follow documented patterns (ROADMAP-*, STAGE*-*, etc.) | |
| **Schema Compliance** | YAML frontmatter present where required per SCHEMAS.md | |
| **No Orphans** | No artifacts outside defined folder structure | |
| **Archive Integrity** | Archived items not modified (read-only) | |

---

## Governance Compliance

| Check | Criteria | Pass/Fail |
|-------|----------|-----------|
| **Authority Boundaries** | No agent claims doctrine authority | |
| **ML1 Gateway** | Doctrine/promotion changes have ML1 approval | |
| **No Silent Drift** | Changes logged in commits/PRs, not implicit | |
| **Doctrine Alignment** | No artifacts contradict binding doctrine | |
| **Constraint Adherence** | Agent outputs respect authority constraints | |

---

## Operational Compliance

| Check | Criteria | Pass/Fail |
|-------|----------|-----------|
| **INBOX Hygiene** | No items > 7 days without triage | |
| **Backlog Hygiene** | No stale items per STAGE1.4_BACKLOG_RULES.md | |
| **Metrics Logged** | Weekly metrics log entries exist | |
| **Stage Closures** | Closed stages have closure recommendation + ML1 sign-off | |
| **Cadence Adherence** | Weekly sync outputs documented | |

---

## Audit Frequency

| Audit Type | Frequency | Trigger |
|------------|-----------|---------|
| **Spot Check** | Per PR | PR opened |
| **Weekly Audit** | Weekly | End of week |
| **Stage Audit** | Per Stage | Stage closure |
| **Full Audit** | Monthly | 1st of month |

---

## Audit Process

### Step 1: Select Scope
- Spot Check: Single PR or artifact
- Weekly: All changes since last audit
- Stage: All stage deliverables
- Full: Entire system portfolio

### Step 2: Run Checklist
- Complete applicable sections above
- Document Pass/Fail per item
- Note issues with paths/details

### Step 3: Report Findings
- Pass: Log completion, no action
- Fail: Create backlog item or escalate

### Step 4: Remediation
- Minor issues: Agent corrects, re-audit
- Major issues: Escalate to ML1

---

## Audit Log Template

```markdown
## Audit Log — [Date]

**Type:** [Spot Check / Weekly / Stage / Full]
**Auditor:** [Agent Name]

### Structural Compliance
- Folder Placement: [PASS/FAIL]
- Naming Convention: [PASS/FAIL]
- Schema Compliance: [PASS/FAIL]
- No Orphans: [PASS/FAIL]
- Archive Integrity: [PASS/FAIL]

### Governance Compliance
- Authority Boundaries: [PASS/FAIL]
- ML1 Gateway: [PASS/FAIL]
- No Silent Drift: [PASS/FAIL]
- Doctrine Alignment: [PASS/FAIL]
- Constraint Adherence: [PASS/FAIL]

### Operational Compliance
- INBOX Hygiene: [PASS/FAIL]
- Backlog Hygiene: [PASS/FAIL]
- Metrics Logged: [PASS/FAIL]
- Stage Closures: [PASS/FAIL]
- Cadence Adherence: [PASS/FAIL]

### Issues Found
- [Issue description + path]

### Remediation
- [Action taken or escalation]
```

---

## Audit Rules Summary

1. **Checklist-driven** — use this checklist, not ad hoc review
2. **Documented** — all audits produce log entry
3. **Graduated response** — minor fix vs major escalation
4. **Non-blocking** — audits inform but don't halt work (unless P0)
5. **ML1 visibility** — monthly summary available to ML1
