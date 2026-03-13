---
id: 10_archive__initiatives__system_portfolio__stage1__stage1_4__stage1_4_backlog_rules_md
title: Stage 1.4 — Backlog Intake and Prioritization Rules
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-11
tags: []
---

# Stage 1.4 — Backlog Intake and Prioritization Rules

## Status
- Status: APPROVED
- Owner: Portfolio Planning Agent
- Date: 2026-01-26

## Purpose
Define rules for backlog intake, classification, prioritization, and lifecycle management.

---

## Backlog Location
Primary: `04_INITIATIVES/SYSTEM_PORTFOLIO/BACKLOG.md`

---

## Intake Rules

### Sources
Items may enter the backlog from:
1. **INBOX promotion** — triaged items needing system work
2. **Stage outputs** — follow-on work identified during stage execution
3. **ML1 directive** — explicit requests from ML1
4. **Agent proposals** — identified gaps or improvements

### Intake Checklist
Before adding an item to backlog:
- [ ] Description is clear and actionable
- [ ] Owner identified (or marked TBD)
- [ ] Dependencies documented (or "None")
- [ ] Does NOT require doctrine change (or flagged for ML1)

### Item Format
```markdown
| ID | Description | Owner | Dependencies | Status |
| SYS-XXX | [Clear description] | [Agent/ML1/TBD] | [Items or "None"] | candidate |
```

---

## Classification Rules

| Classification | Criteria | Example |
|----------------|----------|---------|
| **Governance** | Affects system rules, structure, schemas | Folder restructure, schema update |
| **Integration** | Affects external system connections | New read-only spec, API change |
| **Agent** | Affects agent roles, handoffs, runbooks | New agent, runbook revision |
| **Tooling** | Affects automation, scripts, utilities | Index generator, validation script |
| **Documentation** | Affects reference, research, templates | README update, template addition |

---

## Prioritization Rules

### Priority Levels
| Level | Label | Criteria |
|-------|-------|----------|
| P0 | **Blocker** | Prevents stage progress or compliance |
| P1 | **High** | Required for current stage DoD |
| P2 | **Medium** | Improves efficiency or clarity |
| P3 | **Low** | Nice-to-have, defer if needed |

### Prioritization Authority
- **P0/P1:** ML1 approval required to set or change
- **P2/P3:** Portfolio Planning Agent may propose; ML1 may override

### Prioritization Factors
1. Stage dependency (blocks current work?)
2. Compliance impact (governance/doctrine adjacent?)
3. Effort estimate (quick win vs large effort?)
4. ML1 directive (explicitly requested?)

---

## Lifecycle States

| State | Meaning | Next States |
|-------|---------|-------------|
| `candidate` | Proposed, not yet prioritized | `prioritized`, `rejected` |
| `prioritized` | Accepted, assigned priority | `in_progress`, `blocked` |
| `in_progress` | Actively being worked | `done`, `blocked` |
| `blocked` | Waiting on dependency/decision | `in_progress`, `rejected` |
| `done` | Completed, evidence exists | (archive) |
| `rejected` | Not accepted, with rationale | (archive) |

---

## Backlog Hygiene

### Weekly Review
- Remove `done` items (archive or delete)
- Flag items `candidate` > 14 days (needs decision)
- Flag items `blocked` > 7 days (needs escalation)

### Staleness Thresholds
| State | Stale After | Action |
|-------|-------------|--------|
| `candidate` | 14 days | Escalate to ML1 for decision |
| `blocked` | 7 days | Escalate blocker to ML1 |
| `in_progress` | 30 days | Review scope, consider split |

---

## Backlog Rules Summary

1. **Single source of truth** — all system portfolio items in BACKLOG.md
2. **No implicit priority** — items without explicit priority are `candidate`
3. **ML1 controls P0/P1** — high-priority items require ML1 approval
4. **Weekly hygiene** — Portfolio Planning Agent maintains cleanliness
5. **Evidence required** — `done` items must link to deliverable
