---
id: 02_playbooks__execution__batch_review_worksheet_md
title: Batch Review Worksheet — Template
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Batch Review Worksheet — Template

## Purpose

Enable ML1 to review multiple proposals at once with clarity and control.

---

## Batch Metadata

- **Batch ID:** BATCH-YYYYMMDD-NNN
- **Generated:** (timestamp)
- **Proposals in Batch:** (count)
- **Grouping Criteria:** (type / domain / confidence / sender)

---

## Batch Summary

| Metric | Count |
|--------|-------|
| Total Proposals | |
| High Confidence (≥0.85) | |
| Medium Confidence (0.60-0.84) | |
| Low Confidence (<0.60) | |

### By Object Type

| Object Type | Count |
|-------------|-------|
| | |

### By Sender Domain

| Sender Domain | Count |
|---------------|-------|
| | |

---

## Review Instructions

For each proposal below:
1. Review the classification and proposed action
2. Mark your decision: **A** (Approve) / **R** (Reject) / **D** (Defer)
3. Add notes if needed (especially for rejections)

**Decision Key:**
- **A** = Approve — Execute this action
- **R** = Reject — Do not execute; archive proposal
- **D** = Defer — Review again later

---

## Proposals

### Group: [Group Name]

| # | Proposal ID | Subject | Type | Confidence | Action | Decision | Notes |
|---|-------------|---------|------|------------|--------|----------|-------|
| 1 | PROP-XXX | | | | | [ ] A / R / D | |
| 2 | PROP-XXX | | | | | [ ] A / R / D | |

---

## Batch Decision Summary

After reviewing all proposals:

- **Total Approved:**
- **Total Rejected:**
- **Total Deferred:**

---

## ML1 Sign-Off

- **Reviewed By:** ML1
- **Review Date:**
- **Review Duration:** (optional)
- **Notes:**

---

## Processing Instructions

After ML1 completes this worksheet:

1. For each **Approved**: Move to `queue/approved/`, execute action
2. For each **Rejected**: Move to `queue/rejected/`
3. For each **Deferred**: Move to `queue/deferred/`
4. Update manifest
5. Append decisions to decision log
