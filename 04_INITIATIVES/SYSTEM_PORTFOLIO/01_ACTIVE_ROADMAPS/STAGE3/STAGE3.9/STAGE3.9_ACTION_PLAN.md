---
id: 04_initiatives__system_portfolio__01_active_roadmaps__stage3__stage3_9__stage3_9_action_plan_md
title: Stage 3.9 — Consistency Metric Development
owner: ML1
status: active
created_date: 2026-02-12
last_updated: 2026-02-12
tags: [stage3, roadmap, consistency, metric]
---

# Stage 3.9 — Consistency Metric Development

## Status

- **Status:** 🔄 IN PROGRESS
- **Owner:** ML1
- **Effective Start:** 2026-02-12
- **Closed:** —
- **Authority Gate:** Read-only; metric must not be used to enforce or auto-decide

---

## Stage 3.9 Core Question

> Can we define a clear, repeatable consistency metric that evaluates internal outputs **without creating authority or enforcement**?

**Stage 3.9 succeeds if a measurable, auditable metric exists and is safe to apply in read-only analysis.**

---

## 1. Scope Definition

### In-Scope

| Activity | Purpose |
|----------|---------|
| Define consistency dimensions | Standardize what "consistent" means |
| Define scoring rubric | Make scoring repeatable |
| Define sampling protocol | Ensure comparable evaluations |
| Define reporting format | Make results auditable |
| Define baseline sample set | 6–10 outputs for initial scoring |
| Record baseline report | Stored in `06_RUNS/STAGE3/` |

### Out-of-Scope

| Element | Why Excluded |
|--------|-------------|
| Enforcement or gating | Stage 3 is non-authoritative |
| Auto-remediation | ML1-only |
| External propagation | Stage 3 internal only |
| SB Execution bridge | Stage 3.8 |
| Metric validation / inter-rater testing | Stage 3.10 |

---

## 2. Hard Constraints

1. Read-only analysis only.
2. No recommendations or prescriptions.
3. Metric must not be used to gate execution.

---

## 3. Deliverables

- Consistency Metric Spec v1.0 (`04_INITIATIVES/SYSTEM_PORTFOLIO/01_ACTIVE_ROADMAPS/STAGE3/PLAYBOOKS/CONSISTENCY_METRIC_SPEC.md`)
- Consistency Scoring Worksheet (`04_INITIATIVES/SYSTEM_PORTFOLIO/01_ACTIVE_ROADMAPS/STAGE3/PLAYBOOKS/CONSISTENCY_METRIC_WORKSHEET.md`)
- Baseline sample set definition (to be stored under `06_RUNS/STAGE3/`)
- Baseline scoring report (`06_RUNS/STAGE3/CONSISTENCY_METRIC_BASELINE_REPORT.md`)

---

## 4. Acceptance Criteria

- Metric dimensions and scoring rubric defined
- Worksheet ready for use
- Baseline sampling protocol documented
- Baseline sample set scored
- No authority creep introduced

---

## 5. Test Suite Requirements

| Test | Input | Pass Criteria |
|------|-------|---------------|
| TEST-CM1 | Sample outputs across 3.5–3.7 | Scoring rubric applies cleanly |
| TEST-CM2 | Mixed framing variants | Metric differentiates without prescribing |

---

## 6. Execution Tracking (In Progress)

### Phase 1: Definition (Complete)
| Item | Status | Notes |
|------|--------|-------|
| Draft metric dimensions | ✅ | `CONSISTENCY_METRIC_SPEC.md` |
| Draft scoring rubric | ✅ | 0–2 per dimension |
| Draft worksheet template | ✅ | `CONSISTENCY_METRIC_WORKSHEET.md` |

### Phase 2: Baseline Setup (Planned)
| Item | Status | Notes |
|------|--------|-------|
| Define baseline sample set | ⬜ | 6–10 outputs |
| Score baseline sample set | ⬜ | Use worksheet |
| Record baseline report | ⬜ | Stored in `06_RUNS/STAGE3/` |

---

## 7. Risks & Controls

| Risk | Likelihood | Impact | Control |
|------|------------|--------|---------|
| Metric becomes prescriptive | Medium | High | Read-only rule + no recommendations |
| Overfitting to narrow examples | Medium | Medium | Diverse sample set |

---

## References

- Stage 3 Authorization: `STAGE3_AUTHORIZATION_KICKOFF.md`
- Stage 3.8 (SB Execution Bridge): `STAGE3.8/STAGE3.8_ACTION_PLAN.md`
- Stage 3.10 (Metric Validation): `STAGE3.10/STAGE3.10_ACTION_PLAN.md`
- Metric Spec: `04_INITIATIVES/SYSTEM_PORTFOLIO/01_ACTIVE_ROADMAPS/STAGE3/PLAYBOOKS/CONSISTENCY_METRIC_SPEC.md`
- Metric Worksheet: `04_INITIATIVES/SYSTEM_PORTFOLIO/01_ACTIVE_ROADMAPS/STAGE3/PLAYBOOKS/CONSISTENCY_METRIC_WORKSHEET.md`
