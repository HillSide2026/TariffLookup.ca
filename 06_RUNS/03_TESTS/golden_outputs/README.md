---
id: 06_runs__03_tests__golden_outputs__readme_md
title: Golden Outputs
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Golden Outputs

Expected agent outputs when processing test fixtures.
Used to validate agents produce correct, compliant reports.

## Contents

| Output | Agent | Fixture |
|--------|-------|---------|
| `governance_compliance_report.md` | SYS-005 | pr_changeset |
| `qa_validation_report.md` | SYS-009 | pr_changeset |
| `backlog_prioritization.md` | SYS-006 | (backlog review) |
| `inbox_triage_report.md` | SYS-008 | misplaced + stale |

## Standard Output Format

All outputs must include:
- Summary (3-5 bullets)
- Findings
- Recommendations
- Actions
- Evidence
- Assumptions / Confidence
