---
id: 04_initiatives__system_portfolio__01_active_roadmaps__stage3__stage3_7__stage3_7_action_plan_md
title: Stage 3.7 — Cognitive Consistency Checks (Read-Only)
owner: ML1
status: complete
created_date: 2026-02-11
last_updated: 2026-02-11
tags: [stage3, roadmap, consistency, drift]
---

# Stage 3.7 — Cognitive Consistency Checks (Read-Only)

## Status

- **Status:** ✅ COMPLETE
- **Owner:** ML1
- **Effective Start:** 2026-02-11
- **Closed:** 2026-02-11
- **Authority Gate:** Read-only only; no resolution or authority elevation

---

## Stage 3.7 Core Question

> Can the system surface conflicts and drift **without resolving them**, so ML1 can correct inconsistencies before Stage 4 authority elevation?

**Stage 3.7 succeeds if it reliably flags inconsistencies without acting on them.**

---

## 1. Scope Definition

### In-Scope

| Activity | Purpose |
|----------|---------|
| Detect contradictory doctrine references | Prevent hidden conflicts |
| Flag outdated template usage | Reduce drift |
| Surface inconsistent framing | Improve coherence |
| Identify coverage gaps | Reduce omission risk |

### Out-of-Scope

| Element | Why Excluded |
|--------|-------------|
| Resolving conflicts | ML1-only |
| Recommending changes | Non-authoritative |
| Modifying artifacts | Read-only |

---

## 2. Hard Constraints

1. Read-only: no edits, no propagation.
2. Flags only: no recommendations or prescriptions.
3. No policy creation or interpretation.

---

## 3. Deliverables

- Cognitive Consistency Checker agent definition (`04_INITIATIVES/SYSTEM_PORTFOLIO/01_ACTIVE_ROADMAPS/STAGE3/PLAYBOOKS/COGNITIVE_CONSISTENCY_CHECKER.md`)
- Conflict & drift detection checklist
- Report template (flags only)
- Runbook for scan cadence (manual trigger)

---

## 4. Acceptance Criteria

- Flags are relevant and non-invasive
- No implied authority or recommendations
- SMA-001 governance validation passes

---

## 5. Test Suite Requirements

| Test | Input | Pass Criteria |
|------|-------|---------------|
| TEST-CC1 | Mixed doctrine references in a single packet | Flags contradictions only |
| TEST-CC2 | Outdated template referenced | Flags outdated reference only |
| TEST-CC3 | Inconsistent framing across outputs | Flags inconsistency without resolution |

---

## 6. Execution Tracking (Completed)

### Phase 1: Agent Definition (Planned)
| Item | Status | Notes |
|------|--------|-------|
| Define agent scope + refusal conditions | ✅ | `04_INITIATIVES/SYSTEM_PORTFOLIO/01_ACTIVE_ROADMAPS/STAGE3/PLAYBOOKS/COGNITIVE_CONSISTENCY_CHECKER.md` |
| Define detection checklist | ✅ | Checklist in agent spec |

### Phase 2: Implementation (Planned)
| Item | Status | Notes |
|------|--------|-------|
| Implement scanner | ✅ | Manual trigger (runbook) |
| Implement report template | ✅ | `04_INITIATIVES/SYSTEM_PORTFOLIO/01_ACTIVE_ROADMAPS/STAGE3/PLAYBOOKS/COGNITIVE_CONSISTENCY_REPORT_TEMPLATE.md` |

### Phase 3: Verification (Planned)
| Item | Status | Notes |
|------|--------|-------|
| Run TEST-CC1 | ✅ | `06_RUNS/STAGE3/TESTS_3.7_COGNITIVE_CONSISTENCY.md` |
| Run TEST-CC2 | ✅ | `06_RUNS/STAGE3/TESTS_3.7_COGNITIVE_CONSISTENCY.md` |
| Run TEST-CC3 | ✅ | `06_RUNS/STAGE3/TESTS_3.7_COGNITIVE_CONSISTENCY.md` |

---

## 7. Risks & Controls

| Risk | Likelihood | Impact | Control |
|------|------------|--------|---------|
| False positives overwhelm ML1 | Medium | Medium | Tight checklist + manual trigger |
| Drift signals become prescriptive | Low | High | Flags only, no recommendations |

---

## References

- Stage 3 Authorization: `STAGE3_AUTHORIZATION_KICKOFF.md`
- Stage 3.6 Drafts: `STAGE3.6/STAGE3.6_ACTION_PLAN.md`
- Agent Spec: `04_INITIATIVES/SYSTEM_PORTFOLIO/01_ACTIVE_ROADMAPS/STAGE3/PLAYBOOKS/COGNITIVE_CONSISTENCY_CHECKER.md`
- Test Suite: `06_RUNS/STAGE3/TESTS_3.7_COGNITIVE_CONSISTENCY.md`
- Report Template: `04_INITIATIVES/SYSTEM_PORTFOLIO/01_ACTIVE_ROADMAPS/STAGE3/PLAYBOOKS/COGNITIVE_CONSISTENCY_REPORT_TEMPLATE.md`
- Runbook: `04_INITIATIVES/SYSTEM_PORTFOLIO/01_ACTIVE_ROADMAPS/STAGE3/PLAYBOOKS/COGNITIVE_CONSISTENCY_RUNBOOK.md`
