---
id: 06_runs__inbox_triage__pilot__pilot-2026-01-30-v3__pilot_summary_md
title: Inbox Intelligence Pilot Summary
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Inbox Intelligence Pilot Summary

**Run ID:** pilot-2026-01-30-v3
**Date:** 2026-01-30 06:44:52 UTC
**Classifier Version:** inbox-triage-v0.2

---

## Executive Summary

- **Total Messages Processed:** 100
- **Successfully Classified:** 100 (100.0%)
- **Needs Human Review:** 0
- **Errors:** 0

---

## Classification by Object Type

| Object Type | Count | Percentage |
|-------------|-------|------------|
| Operations — Inquiries | 26 | 26.0% |
| Matters — Activity | 18 | 18.0% |
| Noise | 17 | 17.0% |
| Matters — Client | 15 | 15.0% |
| Firm Management — Vendors / Billing | 15 | 15.0% |
| Operations — Fulfillment | 5 | 5.0% |
| Promotions | 3 | 3.0% |
| System Notification | 1 | 1.0% |

---

## Classification by Lifecycle State

| Lifecycle State | Count | Percentage |
|-----------------|-------|------------|
| Reference | 50 | 50.0% |
| Action Required | 49 | 49.0% |
| Waiting | 1 | 1.0% |

---

## Classification by System Domain

| System Domain | Count | Percentage |
|---------------|-------|------------|
| Matters | 33 | 33.0% |
| Operations | 31 | 31.0% |
| Personal Noise | 20 | 20.0% |
| Firm Management | 15 | 15.0% |
| System Operations | 1 | 1.0% |

---

## Confidence Distribution

| Confidence Level | Threshold | Count | Percentage |
|------------------|-----------|-------|------------|
| High | >= 0.85 | 1 | 1.0% |
| Medium | 0.60 - 0.84 | 99 | 99.0% |
| Low (Needs Human) | < 0.60 | 0 | 0.0% |

---

## Success Criteria Assessment

| Criterion | Target | Actual | Status |
|-----------|--------|--------|--------|
| Classification Rate | >= 90% | 100.0% | PASS |
| No Forbidden Operations | 0 | 0 | PASS |
| Logs Complete | Yes | Yes | PASS |
| Append-Only | Yes | Yes | PASS |

---

## Outputs Generated

- `06_RUNS/INBOX_TRIAGE/logs/classification_log.ndjson`
- `06_RUNS/INBOX_TRIAGE/pilot/pilot-2026-01-30-v3/placement_plans/` (100 plans)
- `06_RUNS/INBOX_TRIAGE/pilot/pilot-2026-01-30-v3/pilot_summary.md`

---

## Governance Notes

- **No Gmail writes occurred** - All operations read-only
- **No message movement** - Proposals only
- **No external system modifications** - Repo-local outputs only
- **Audit log maintained** - NDJSON append-only format

---

## Next Steps

1. SYS-005 Governance Review
2. SYS-009 QA Validation
3. ML1 Review of classifications
4. Stage 2.3 closure determination
