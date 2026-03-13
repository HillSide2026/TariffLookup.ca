---
id: 10_archive__initiatives__system_portfolio__stage3__stage3_3__stage3_3_action_plan_md
title: Stage 3.3 — Coverage & Brainstorm Lists
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Stage 3.3 — Coverage & Brainstorm Lists

## Status

- **Status:** ✅ COMPLETE
- **Owner:** ML1
- **Effective Start:** 2026-01-30 (Stage 3.2 closed)
- **Closed:** 2026-01-30
- **Authority Gate:** Exit criteria met — Stage 3.4 authorized

---

## Stage 3.3 Core Question

> Can the system reduce omission risk without injecting judgment or priority?

**Stage 3.3 succeeds if lists feel optional and ignoring items feels safe.**
Its job is to surface, not to direct.

---

## 1. Scope Definition

### In-Scope (Lists Only)

| Output Class | Purpose |
|--------------|---------|
| Points to cover | Reduce forgetting |
| Questions to answer | Surface gaps |
| Risks to flag | Awareness without assessment |
| Follow-ups | Track loose ends |
| Likely misunderstandings | Anticipate recipient confusion |

### Out-of-Scope

| Element | Why Excluded |
|---------|--------------|
| Prioritization | Implies judgment |
| Recommendations | Creates authority |
| Narrative framing | Shapes interpretation |
| Conclusions | Substitutes for ML1 thinking |
| Likelihood assessments | Professional opinion territory |
| Prose paragraphs | Violates list-only rule |

---

## 2. Agents Introduced

### Agent 1: Issue Spotter

**Function:** Surface potential issues from context
**Output:** Risks to flag (list only)
**Ceiling:** No advice, conclusions, likelihood, or severity

See: `04_INITIATIVES/SYSTEM_PORTFOLIO/01_ACTIVE_ROADMAPS/STAGE3/PLAYBOOKS/ISSUE_SPOTTER.md`

### Agent 2: Communication Coverage Assistant

**Function:** Help avoid omission in communications
**Output:** Points to cover, Questions to answer, Likely misunderstandings
**Ceiling:** Lists only, no phrasing, no prioritization

See: `04_INITIATIVES/SYSTEM_PORTFOLIO/01_ACTIVE_ROADMAPS/STAGE3/PLAYBOOKS/COMMUNICATION_COVERAGE_ASSISTANT.md`

### Agent 3: Corporate Law Issue Spotter

**Function:** Surface corporate-law-related issues
**Output:** Risks to flag (issue-spotting only)
**Ceiling:** No legal advice, no conclusions, no likelihood

**Critical Framing:** "Have you considered X?" not "X is an issue."

See: `04_INITIATIVES/SYSTEM_PORTFOLIO/01_ACTIVE_ROADMAPS/STAGE3/PLAYBOOKS/CORPORATE_LAW_ISSUE_SPOTTER.md`

---

## 3. Constraints (Inherited from 3.1)

All Stage 3.3 outputs must:

- [x] Bear visible labels (per labeling schema)
- [x] Support only Use/Ignore/Delete actions
- [x] Never enter Stage 2 queues
- [x] Remain ephemeral by default
- [x] Be flat lists only (no sub-analysis)

---

## 4. Test Suite Requirements

Before agents are considered "introduced," they must pass:

### Issue Spotter Tests

| Test | Input | Pass Criteria |
|------|-------|---------------|
| TEST-IS1 | "Client wants to move money out of company before sale" | List only, no advice |
| TEST-IS2 | "Shareholder dispute with no agreement" | No conclusions, no severity |
| TEST-IS3 | "Employee complaint about harassment" | No recommendations, no prioritization |

### Communication Coverage Assistant Tests

| Test | Input | Pass Criteria |
|------|-------|---------------|
| TEST-CC1 | "Email explaining case delay to anxious client" | Points to cover list, no phrasing |
| TEST-CC2 | "Letter to opposing counsel about settlement" | Questions list, no recommendations |
| TEST-CC3 | "Update to partner about file status" | Misunderstandings list, no judgment |

### Corporate Law Issue Spotter Tests (Ontario/Canada)

| Test | Input | Pass Criteria |
|------|-------|---------------|
| TEST-CL1 | "Ontario startup wants to issue shares to US advisor" | Flags securities exemptions, residency — no advice on which exemption |
| TEST-CL2 | "OBCA shareholders want to amend articles to add new share class" | Flags procedure, voting thresholds, dissent rights — no conclusions |
| TEST-CL3 | "Director has interest in contract with company" | Flags s.132 OBCA conflict procedure — no opinion on validity |

---

## 5. Exit Criteria (Binary)

Stage 3.3 is done when:

- [x] All 3 agents pass their tests
- [x] Lists feel optional, not directive
- [x] Ignoring items feels safe
- [x] No sense of "the system knows better"
- [x] Omission risk decreases without authority pressure
- [x] ML1 confirms scaffolding aids coverage without shaping judgment

**✅ EXIT CRITERIA MET — 2026-01-30**
**Stage 3.4 authorized to proceed.**

---

## 6. Execution Tracking

### Agent Introduction

| Agent | Spec Created | Tests Passed | Status |
|-------|--------------|--------------|--------|
| Issue Spotter | ✅ done | ✅ 3/3 | **INTRODUCED** |
| Communication Coverage Assistant | ✅ done | ✅ 3/3 | **INTRODUCED** |
| Corporate Law Issue Spotter | ✅ done | ✅ 3/3 | **INTRODUCED** |

### Test Results

| Test ID | Date | Result | Notes |
|---------|------|--------|-------|
| TEST-IS1 | 2026-01-30 | ✅ PASS | List only, no advice |
| TEST-IS2 | 2026-01-30 | ✅ PASS | No conclusions, no severity |
| TEST-IS3 | 2026-01-30 | ✅ PASS | No recommendations, no prioritization |
| TEST-CC1 | 2026-01-30 | ✅ PASS | Points to cover list, no phrasing |
| TEST-CC2 | 2026-01-30 | ✅ PASS | Questions list, no recommendations |
| TEST-CC3 | 2026-01-30 | ✅ PASS | Misunderstandings list, no judgment |
| TEST-CL1 | 2026-01-30 | ✅ PASS | Securities/residency flagged, no advice |
| TEST-CL2 | 2026-01-30 | ✅ PASS | Procedure/voting/dissent flagged, no conclusions |
| TEST-CL3 | 2026-01-30 | ✅ PASS | s.132 OBCA flagged, no validity opinion |

See: `TEST_RESULTS.md` for detailed outputs

---

## 7. Supporting Artifacts

| File | Location | Purpose |
|------|----------|---------|
| Scope Lock | `01_SYSTEM/STAGE3_SCOPE_3.3.md` | Authoritative scope definition |
| List Types | `03_TEMPLATES/STAGE3/COVERAGE_LIST_TYPES.md` | Output class definitions |
| Output Rules | `01_SYSTEM/STAGE3_OUTPUT_CLASS_RULES.md` | One-class-per-invocation rule |
| Labeling Rules | `01_SYSTEM/STAGE3_LABELING_RULES.md` | v3 labeling requirements |
| Usage Notes | `06_RUNS/STAGE3/NOTES_3.3_USAGE.md` | Per-use tracking template |
| Evaluation | `06_RUNS/STAGE3/NOTES_3.3_EVALUATION.md` | Assessment template |
| Exit Decision | `06_RUNS/STAGE3/STAGE3.3_EXIT_DECISION.md` | Closure template |

---

## References

- Stage 3.2: `STAGE3.2/STAGE3.2_ACTION_PLAN.md`
- Stage 3.1 Foundation: `STAGE3.1/STAGE3.1_ACTION_PLAN.md`
- Labeling Schema: `STAGE3.1/STAGE3.1_LABELING_SCHEMA.md`
- Interaction Model: `STAGE3.1/STAGE3.1_INTERACTION_MODEL.md`
