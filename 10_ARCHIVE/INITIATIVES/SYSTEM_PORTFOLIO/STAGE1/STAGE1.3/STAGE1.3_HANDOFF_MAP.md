---
id: 10_archive__initiatives__system_portfolio__stage1__stage1_3__stage1_3_handoff_map_md
title: Stage 3 — Agent Handoff Map
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Stage 3 — Agent Handoff Map

## Status
- Status: APPROVED
- Owner: System Governance Agent
- Date: 2026-01-26

## Purpose
Define inputs, outputs, and sequencing for agent interactions within the system portfolio.

---

## Handoff Matrix

| From Agent | To Agent | Artifact Type | Trigger |
|------------|----------|---------------|---------|
| Portfolio Planning | System Governance | Closure recommendation | Stage DoD met |
| Portfolio Planning | All Agents | Backlog items | Prioritization update |
| System Governance | ML1 | Compliance report | PR review |
| System Governance | Knowledge Curation | Flagged artifacts | Compliance issue |
| Integration Steward | System Governance | Updated specs | Spec change |
| Integration Steward | Runbook & QA | Integration docs | QA request |
| Knowledge Curation | System Governance | Promotion proposal | Artifact ready |
| Knowledge Curation | Portfolio Planning | Staleness report | Periodic review |
| Runbook & QA | System Governance | QA report | Validation complete |
| Runbook & QA | Portfolio Planning | Runbook draft | Ready for review |

---

## Sequencing Flows

### Flow 1: New Artifact Intake
```
INBOX artifact created
    → Knowledge Curation: index + classify
    → System Governance: validate placement
    → Portfolio Planning: add to backlog (if applicable)
    → ML1: approve promotion (if doctrine/playbook/template)
```

### Flow 2: Stage Closure
```
Stage work complete
    → Runbook & QA: validate deliverables
    → System Governance: compliance check
    → Portfolio Planning: prepare closure package
    → ML1: approve closure
    → Knowledge Curation: archive completed stage
```

### Flow 3: Integration Spec Update
```
Integration requirement change
    → Integration Steward: update spec
    → System Governance: validate no-write-path
    → Runbook & QA: update related runbooks
    → Portfolio Planning: log change in backlog
```

### Flow 4: Compliance Issue
```
System Governance flags issue
    → Knowledge Curation: locate related artifacts
    → Runbook & QA: validate against schema
    → Portfolio Planning: prioritize fix
    → ML1: approve resolution (if doctrine-adjacent)
```

---

## Artifact Paths by Agent

| Agent | Primary Output Location |
|-------|------------------------|
| System Governance | `06_RUNS/RUN-*/compliance/` |
| Portfolio Planning | `04_INITIATIVES/SYSTEM_PORTFOLIO/BACKLOG.md` |
| Integration Steward | `10_ARCHIVE/INITIATIVES/SYSTEM_PORTFOLIO/STAGE2/` (read), new specs in active stages |
| Knowledge Curation | `00_SYSTEM/`, `08_RESEARCH/`, `09_INBOX/` |
| Runbook & QA | `02_PLAYBOOKS/`, `04_INITIATIVES/.../STAGE*/` |

---

## Handoff Rules

1. **Explicit artifact paths** — all handoffs reference specific file paths
2. **No implicit state** — handoff triggers are documented events
3. **ML1 gateway** — doctrine/governance changes require ML1 in the flow
4. **Audit trail** — handoffs logged in run logs or commit messages
5. **No circular dependencies** — flows terminate at ML1 or archive

---

## Validation Checklist
| Check | Status |
|-------|--------|
| All 5 agents have defined inputs | ✓ |
| All 5 agents have defined outputs | ✓ |
| Sequencing flows documented | ✓ |
| ML1 approval points identified | ✓ |
| No circular dependencies | ✓ |
