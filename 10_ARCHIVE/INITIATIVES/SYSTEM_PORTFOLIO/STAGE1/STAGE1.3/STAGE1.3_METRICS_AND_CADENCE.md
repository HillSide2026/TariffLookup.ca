---
id: 10_archive__initiatives__system_portfolio__stage1__stage1_3__stage1_3_metrics_and_cadence_md
title: Stage 3 — Metrics and Review Cadence
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Stage 3 — Metrics and Review Cadence

## Status
- Status: APPROVED
- Owner: Portfolio Planning Agent
- Date: 2026-01-26

## Purpose
Define metrics for system reliability and auditability, and establish review cadence.

---

## System Metrics

### 1. Artifact Compliance Rate
**Definition:** Percentage of artifacts that pass schema and placement validation.
**Target:** ≥95%
**Measurement:** System Governance Agent compliance reports
**Frequency:** Per PR / Weekly summary

### 2. INBOX Triage Time
**Definition:** Average days from artifact creation in INBOX to triage decision.
**Target:** ≤7 days (per INBOX rules)
**Measurement:** Knowledge Curation Agent triage reports
**Frequency:** Weekly

### 3. Stage Completion Velocity
**Definition:** Days from stage kickoff to closure recommendation.
**Target:** Establish baseline (no target yet)
**Measurement:** Portfolio Planning Agent stage tracking
**Frequency:** Per stage

### 4. Handoff Success Rate
**Definition:** Percentage of handoffs completed without rework.
**Target:** ≥90%
**Measurement:** Runbook & QA Agent validation reports
**Frequency:** Weekly

### 5. Doctrine Conflict Rate
**Definition:** Number of PRs flagged for doctrine conflicts per week.
**Target:** ≤2 per week
**Measurement:** System Governance Agent compliance reports
**Frequency:** Weekly

---

## Review Cadence

### Daily (Async)
- **INBOX scan:** Knowledge Curation Agent checks for new items
- **PR compliance:** System Governance Agent reviews open PRs

### Weekly
- **Portfolio sync:** Portfolio Planning Agent updates backlog
- **Metrics summary:** All agents contribute to weekly metrics log
- **ML1 review point:** Summary available for ML1 (async, no meeting required)

### Per Stage
- **Kickoff review:** ML1 approves stage authorization
- **DoD checkpoint:** Portfolio Planning Agent validates deliverables
- **Closure review:** ML1 approves stage closure

### Monthly (Optional)
- **Roadmap health check:** Review roadmap progress, adjust priorities
- **Staleness audit:** Knowledge Curation Agent flags overdue items

---

## Metrics Log Template

```markdown
## Metrics Log — Week of YYYY-MM-DD

### Artifact Compliance Rate
- PRs reviewed: X
- Passed: Y
- Rate: Y/X%

### INBOX Triage
- Items in INBOX at start: X
- Items triaged: Y
- Items overdue (>7 days): Z

### Handoff Success
- Handoffs attempted: X
- Completed without rework: Y
- Rate: Y/X%

### Doctrine Conflicts
- Conflicts flagged: X

### Notes
- [Any observations or escalations]
```

---

## Escalation Thresholds

| Metric | Threshold | Action |
|--------|-----------|--------|
| Compliance Rate < 90% | Immediate | System Governance reviews process |
| INBOX backlog > 10 items | 48 hours | Knowledge Curation prioritizes triage |
| Doctrine conflicts > 5/week | Immediate | ML1 review of contributor guidance |
| Handoff rework > 20% | Weekly | Runbook & QA reviews handoff clarity |

---

## Validation Checklist
| Check | Status |
|-------|--------|
| Metrics defined with targets | ✓ |
| Measurement method specified | ✓ |
| Cadence documented | ✓ |
| Escalation thresholds set | ✓ |
| Log template provided | ✓ |
