---
id: 10_archive__initiatives__system_portfolio__stage1__stage1_4__stage1_4_operating_cadence_md
title: Stage 1.4 — Operating Cadence
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-11
tags: []
---

# Stage 1.4 — Operating Cadence

## Status
- Status: APPROVED
- Owner: Portfolio Planning Agent
- Date: 2026-01-26

## Purpose
Define the roadmap-to-run cadence for the System Portfolio, including schedules, review triggers, and handoff points.

---

## Cadence Overview

| Rhythm | Frequency | Owner | Purpose |
|--------|-----------|-------|---------|
| Daily Async | Daily | All Agents | INBOX scan, PR review |
| Weekly Sync | Weekly | Portfolio Planning | Backlog update, metrics log |
| Stage Review | Per Stage | ML1 | DoD validation, closure approval |
| Monthly Health | Monthly | ML1 + Agents | Roadmap progress, priority adjustment |

---

## Daily Async Cadence

**Participants:** All system-level agents
**Trigger:** Start of day (async, no meeting)

### Activities
1. **Knowledge Curation Agent:** Scan INBOX for new items
2. **System Governance Agent:** Review open PRs for compliance
3. **Integration Steward Agent:** Check for spec update requests
4. **Runbook & QA Agent:** Process pending QA requests
5. **Portfolio Planning Agent:** Log any blockers or escalations

### Outputs
- INBOX triage notes (if new items)
- PR compliance comments
- Escalation flags (if any)

---

## Weekly Sync Cadence

**Participants:** Portfolio Planning Agent (lead), all agents contribute
**Trigger:** End of week (Friday async or Monday review)

### Activities
1. Update `BACKLOG.md` with completed/new items
2. Compile weekly metrics log (per STAGE3_METRICS_AND_CADENCE.md)
3. Flag overdue INBOX items (>7 days)
4. Prepare ML1 summary (if escalations exist)

### Outputs
- Updated BACKLOG.md
- Weekly metrics log entry
- ML1 summary (optional, async)

---

## Stage Review Cadence

**Participants:** ML1 (decision), Portfolio Planning Agent (prepare)
**Trigger:** Stage DoD met

### Activities
1. Portfolio Planning Agent prepares closure package
2. System Governance Agent validates compliance
3. Runbook & QA Agent confirms deliverable quality
4. ML1 reviews and approves/rejects closure

### Outputs
- Stage closure recommendation
- ML1 sign-off
- Archive instruction (if approved)

---

## Monthly Health Check

**Participants:** ML1, all agents (async input)
**Trigger:** First week of month

### Activities
1. Review roadmap progress against milestones
2. Assess backlog health (size, age, blockers)
3. Adjust priorities based on ML1 input
4. Flag any structural or governance concerns

### Outputs
- Monthly status summary
- Priority adjustments (if any)
- Roadmap amendments (if needed, via PR)

---

## Trigger Conditions Summary

| Event | Trigger | Response |
|-------|---------|----------|
| New INBOX item | Item created | Knowledge Curation triages within 7 days |
| PR opened | PR created | System Governance reviews within 24 hours |
| Stage DoD met | All deliverables complete | Portfolio Planning prepares closure |
| Escalation flagged | Agent cannot proceed | ML1 notified within 24 hours |
| Monthly boundary | 1st of month | Health check initiated |

---

## Cadence Rules

1. **Async by default** — no meetings unless ML1 requests
2. **Documented outputs** — all cadence activities produce artifacts
3. **ML1 gateway preserved** — no auto-approvals or implicit promotions
4. **Metrics tracked** — weekly log captures cadence health
5. **Escalation paths clear** — blockers surface within 24 hours
