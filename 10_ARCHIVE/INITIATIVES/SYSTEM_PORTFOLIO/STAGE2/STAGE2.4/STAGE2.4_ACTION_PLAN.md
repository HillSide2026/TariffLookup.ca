---
id: 10_archive__initiatives__system_portfolio__stage2__stage2_4__stage2_4_action_plan_md
title: Stage 2.4 — Cognitive Operational Validation (Human-in-the-Loop)
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Stage 2.4 — Cognitive Operational Validation (Human-in-the-Loop)

## Status

- **Status:** CLOSED (ML1 PROCEED determination issued)
- **Owner:** ML1
- **Execution Owners:** SYS-008 (Knowledge Curation), SYS-005 (Governance), SYS-009 (Runbook & QA)
- **Authorized:** 2026-01-29
- **Closed:** 2026-01-30

---

## Purpose

Validate that the system can complete a full cognitive operating cycle—observe, classify, log, and present judgments—in a way that is:

- understandable to ML1,
- conservative under uncertainty,
- auditable and repeatable,
- and free of any execution or side effects.

**Stage 2.4 answers one question only:**

> "Do I trust how the system thinks about my inbox?"

It does not authorize the system to act.

---

## Preconditions ✅ ALL MET

- [x] Stage 2.3 pilot executed (bounded) — 100 messages, 2026-01-29
- [x] Draft Placement Plans generated — 100 plans
- [x] Classification log populated — classification_log.ndjson
- [x] Pilot summary report completed — pilot_summary.md
- [x] SYS-005 PASS (governance) — STAGE2.3_GOVERNANCE_REPORT.md
- [x] SYS-009 PASS (QA) — STAGE2.3_QA_REPORT.md

---

## Scope (Authorized)

Stage 2.4 is authorized to:

- Review pilot outputs with ML1 in the loop
- Evaluate classification quality and failure modes
- Calibrate confidence thresholds and heuristics
- Refine taxonomy definitions if required
- Define acceptable vs unacceptable error classes
- Decide readiness for future automation stages

---

## Explicitly Out of Scope

Stage 2.4 is **not** authorized to:

- Move, label, archive, or reply to Gmail messages
- Write back to Gmail or any external system
- Schedule recurring or background runs
- Perform unattended operation
- Introduce SharePoint / Word integrations
- Promote proposals into execution

---

## Workstreams

### Workstream A — Human Review of Pilot Outputs

**Owner:** ML1
**Support:** SYS-008

**Steps:**

1. [ ] Review a representative sample of Draft Placement Plans:
   - across object types
   - across lifecycle states
   - across confidence bands
2. [ ] Identify:
   - obvious misclassifications
   - ambiguous cases
   - overconfident vs underconfident predictions
3. [ ] Record qualitative feedback:
   - "Correct"
   - "Acceptable but imprecise"
   - "Incorrect"
   - "Should have been Unknown"

**Deliverables:**

- ML1 review notes
- Annotated examples (non-binding)

---

### Workstream B — Error & Confidence Analysis

**Owner:** SYS-008
**Validation:** SYS-009

**Steps:**

1. [ ] Analyze pilot summary metrics:
   - distribution by category
   - Unknown / Needs Human rate
   - confidence distribution
2. [ ] Identify systematic error patterns:
   - sender-based confusion
   - subject-line ambiguity
   - category overlap
3. [ ] Propose adjustments:
   - confidence thresholds
   - heuristic rules
   - escalation to Unknown

**Deliverables:**

- Error analysis memo
- Proposed calibration changes (no execution)

---

### Workstream C — Taxonomy & Rules Refinement (If Needed)

**Owner:** ML1
**Drafting:** SYS-008
**Governance:** SYS-005

**Steps:**

1. [ ] Determine whether taxonomy changes are required:
   - split categories
   - merge categories
   - clarify definitions
2. [ ] Update taxonomy artifacts (versioned)
3. [ ] Archive prior versions with change notes

**Deliverables:**

- Updated taxonomy (if changed)
- Change log with rationale

---

### Workstream D — Cognitive Readiness Determination

**Owner:** ML1
**Advisory:** SYS-005, SYS-009

**Steps:**

1. [ ] Evaluate whether:
   - classifications are understandable
   - uncertainty is handled conservatively
   - errors are acceptable in kind and frequency
2. [ ] Decide one of:
   - **Proceed** (system cognition is acceptable)
   - **Revise and re-pilot** (remain in 2.4)
   - **Pause** (design reconsideration)

**Deliverables:**

- Stage 2.4 decision memo
- Explicit go / no-go recommendation for future automation stages

---

## Definition of Done (Stage 2.4)

Stage 2.4 may be closed when:

- [x] ML1 has reviewed pilot outputs (9 samples, 89% accuracy)
- [x] Error patterns are documented (ERROR_ANALYSIS_MEMO.md)
- [x] Confidence thresholds are calibrated (or explicitly accepted) — accepted as-is
- [x] Taxonomy is finalized or affirmed (v1.3 hierarchical structure)
- [x] SYS-005 confirms no scope creep into execution
- [x] SYS-009 confirms documentation integrity
- [x] ML1 issues a written readiness determination (2026-01-30, PROCEED)

---

## Outcome of Stage 2.4

A successful Stage 2.4 produces:

- Trust (or explicit lack of trust) in system judgment
- A calibrated, human-aligned inbox intelligence layer
- A clear decision on whether and how to proceed toward execution stages

**No operational behavior changes occur as a result of this stage.**

---

## Execution Tracking

### Workstream A: Human Review ✅ COMPLETE
| Item | Status | Date | Notes |
|------|--------|------|-------|
| Sample selection | ✅ done | 2026-01-29 | 9 representative samples |
| Review across object types | ✅ done | 2026-01-29 | 5 object types covered |
| Review across lifecycle states | ✅ done | 2026-01-29 | 3 states covered |
| Review across confidence bands | ✅ done | 2026-01-29 | High and low confidence |
| Feedback recorded | ✅ done | 2026-01-29 | C/A/I/U ratings + notes |
| ML1 review notes produced | ✅ done | 2026-01-29 | ML1_REVIEW_WORKSHEET.md |

### Workstream B: Error Analysis ✅ COMPLETE
| Item | Status | Date | Notes |
|------|--------|------|-------|
| Metrics analysis | ✅ done | 2026-01-29 | 89% accuracy (C+A) |
| Error pattern identification | ✅ done | 2026-01-29 | 4 patterns identified |
| Calibration proposals | ✅ done | 2026-01-29 | Taxonomy changes proposed |
| Error analysis memo | ✅ done | 2026-01-29 | ERROR_ANALYSIS_MEMO.md |

### Workstream C: Taxonomy Refinement ✅ COMPLETE
| Item | Status | Date | Notes |
|------|--------|------|-------|
| Change determination | ✅ done | 2026-01-29 | Hierarchical restructure needed |
| Taxonomy updates (if any) | ✅ done | 2026-01-30 | v1.0 → v1.1 → v1.2 → v1.3 |
| Change log | ✅ done | 2026-01-30 | Full changelog in TAXONOMY.md |
| Pilot v2 with new taxonomy | ✅ done | 2026-01-30 | 100 msgs, 100% classified |

### Workstream D: Readiness Determination ✅ COMPLETE
| Item | Status | Date | Notes |
|------|--------|------|-------|
| Cognitive evaluation | ✅ done | 2026-01-29 | ML1 marked "Proceed" |
| Decision made | ✅ done | 2026-01-29 | Proceed with refinements |
| Taxonomy v1.3 approved | ✅ done | 2026-01-30 | Hierarchical structure |
| Pilot v2 executed | ✅ done | 2026-01-30 | 100% classification rate |
| SYS-005 governance sign-off | ✅ done | 2026-01-30 | No scope creep confirmed |
| SYS-009 QA sign-off | ✅ done | 2026-01-30 | Documentation integrity confirmed |
| Decision memo | ✅ done | 2026-01-30 | STAGE2.4_READINESS_DETERMINATION.md signed |

---

## References

- Stage 2.3 Action Plan: `STAGE2/STAGE2.3/STAGE2.3_ACTION_PLAN.md`
- Pilot v1 Summary: `06_RUNS/INBOX_TRIAGE/pilot/pilot-2026-01-29/pilot_summary.md`
- Pilot v2 Summary: `06_RUNS/INBOX_TRIAGE/pilot/pilot-2026-01-30-v2/pilot_summary.md`
- Placement Plans: `06_RUNS/INBOX_TRIAGE/pilot/pilot-2026-01-30-v2/placement_plans/`
- Classification Log: `06_RUNS/INBOX_TRIAGE/logs/classification_log.ndjson`
- Taxonomy (v1.3): `02_PLAYBOOKS/core/inbox_triage/TAXONOMY.md`
- Classifier Interface: `02_PLAYBOOKS/core/inbox_triage/CLASSIFIER_INTERFACE.md`
- Classifier Script (v0.2): `scripts/inbox_classifier.py`

---

## QC Review Notes (2026-01-29)

**Reviewer:** Claude (on behalf of ML1)

### Assessment: APPROVED

**Strengths:**

1. Clear single question focus: "Do I trust how the system thinks?"
2. Explicit non-execution constraint maintained
3. Human-in-the-loop design ensures ML1 control
4. Four workstreams provide comprehensive validation
5. Decision outcomes well-defined (Proceed/Revise/Pause)

**Observations:**

1. All preconditions are now met (Stage 2.3 complete)
2. Workstream A (Human Review) should begin immediately
3. No code changes required — this is a review/validation stage
4. Stage 2.4 is inherently interactive (requires ML1 judgment)

**Status:** Ready to begin Workstream A.
