---
id: 10_archive__initiatives__system_portfolio__stage3__stage3_1__stage3_1_action_plan_md
title: Stage 3.1 — Foundation & Guardrails
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Stage 3.1 — Foundation & Guardrails

## Status

- **Status:** ✅ COMPLETE
- **Owner:** ML1
- **Effective Start:** 2026-01-30 (Stage 2.6 closed)
- **Closed:** 2026-01-30
- **Authority Gate:** Exit criteria met — Stage 3.2 authorized

---

## Stage 3.1 Core Question

> Can we introduce generation without accidentally introducing authority, approval semantics, or execution gravity?

**Stage 3.1 succeeds even if nothing useful is generated yet.**
Its job is to make misuse structurally difficult, not to deliver value.

---

## 1. The Three Non-Negotiable Contracts

Stage 3.1 exists to lock in three contracts that all later sub-stages inherit.

### 1.1 Authorship Contract

**The system never speaks as ML1.**

Implications:
- Generated content is always explicitly "other"
- ML1-authored content is never auto-mingled
- There is no ambiguous middle state

*This is about psychology, not just labeling.*

### 1.2 Interaction Contract

**Generated content is never something you "approve."**

Implications:
- No accept / approve / confirm actions
- No "this is ready" affordances
- Generated artifacts are disposable by default

*This prevents Stage 2 muscle memory from leaking in.*

### 1.3 Authority Contract

**Nothing generated in Stage 3 can cause anything else to happen.**

Implications:
- No queues
- No workflows
- No downstream systems
- No persistence as "work"

*Stage 3 is a sandbox, not a pipeline.*

---

## 2. Concrete Components

### 2.1 Artifact Labeling System (Hard Requirement)

Every generated artifact must have:

**A. A visible prefix**
- "System-generated outline"
- "System-generated coverage list"
- "System-generated summary"

Not subtle. Not metadata-only.

**B. A fixed visual treatment**
- Different typography or container
- Something your eye learns to treat as "not you"

**C. A non-removable origin marker**
- Even if copied, origin is obvious
- No silent blending into authored text

**Test:** If you can copy/paste something and forget where it came from, Stage 3.1 has failed.

---

### 2.2 Interaction Model Enforcement

**Only three actions are permitted on Stage 3 artifacts:**

| Allowed | Meaning |
|---------|---------|
| **Use** | Copy parts into your own work |
| **Ignore** | Do nothing |
| **Delete** | Remove from view |

**Explicitly forbidden:**

| Forbidden | Why |
|-----------|-----|
| Approve | Creates authority |
| Accept | Implies completion |
| Confirm | Implies correctness |
| Send | Creates execution |
| Promote | Creates workflow |
| Queue | Creates persistence |

There should be no UI affordance that implies completion or readiness.

---

### 2.3 Stage 2.x / Stage 3 Separation Rules

This is a hard boundary, not conceptual.

**Stage 3 artifacts:**
- Do NOT enter proposal queues
- Do NOT get IDs like Stage 2 items
- Do NOT have lifecycle states
- Do NOT accumulate decisions

**Stage 2 artifacts:**
- ARE reviewable
- ARE approvable
- CAN cause action

**No object may belong to both stages.**

If an engineer asks, "Can we reuse the same object type?"
The answer in 3.1 is **no**.

---

## 3. Persistence Rules

### 3.1 Default: Ephemeral-by-Default

- Generated artifacts are not system records
- Closing a session can destroy them
- Persistence is opt-in, manual, and explicit

*This reinforces disposability.*

### 3.2 If Persistence Exists at All

If saving is allowed:
- Saved artifacts are clearly marked as "reference only"
- They are not treated as outputs
- They do not train behavior automatically

**No learning loops yet.**

---

## 4. Failure Signal Detection

### 4.1 Primary Failure Signals

Any of the following is an immediate red flag:

- [ ] You feel tempted to "just clean it up and send"
- [ ] You want an "approve" button
- [ ] You forget whether you wrote something
- [ ] You trust the system's phrasing
- [ ] You feel slower, not faster

**These are stop signals, not tuning opportunities.**

### 4.2 Required Kill-Switch Behavior

If failure signals appear:
1. Stage 3 expansion pauses
2. No new agents are introduced
3. No scope is widened
4. Revert to previous sub-stage

*This must be culturally accepted before it's needed.*

---

## 5. What Is Explicitly Out of Scope in Stage 3.1

To be clear, Stage 3.1 does NOT include:

- ❌ Any agent (named or otherwise)
- ❌ Any domain specialization
- ❌ Any drafting capability
- ❌ Any reuse of generated text
- ❌ Any memory or personalization
- ❌ Any improvement loop

**If something feels "underwhelming" at this stage, that's correct.**

---

## 6. Deliverables (Behavioral Guarantees, Not Features)

Stage 3.1 produces behavioral guarantees, not features.

### Required Outcomes

By the end of Stage 3.1:

- [ ] You instinctively treat generated content as disposable
- [ ] You never look for an approval affordance
- [ ] You clearly distinguish:
  - "things to decide" (Stage 2)
  - "things to think with" (Stage 3)
- [ ] There is no anxiety about accidental execution

**If these are true, 3.1 is complete.**

---

## 7. Exit Criteria (Binary)

Stage 3.1 is done when:

- [x] Labels are automatic and unavoidable
- [x] Interaction model is enforced by design, not discipline
- [x] No object crosses the Stage 2 / Stage 3 boundary
- [x] You feel safe experimenting with generation

**✅ EXIT CRITERIA MET — 2026-01-30**
**Stage 3.2 authorized to proceed.**

---

## 8. One-Sentence Lock

> Stage 3.1 establishes non-authoritative, non-approvable, non-executing generation with unmistakable labeling and hard separation from all decision and action workflows.

---

## Execution Tracking

### Component A: Artifact Labeling System ✅ COMPLETE
| Item | Status | Date | Notes |
|------|--------|------|-------|
| Labeling schema document | ✅ done | 2026-01-30 | STAGE3.1_LABELING_SCHEMA.md |
| Visual treatment spec | ✅ done | 2026-01-30 | Included in labeling schema |
| Origin marker design | ✅ done | 2026-01-30 | Included in labeling schema |

### Component B: Interaction Model ✅ COMPLETE
| Item | Status | Date | Notes |
|------|--------|------|-------|
| Allowed actions defined | ✅ done | 2026-01-30 | STAGE3.1_INTERACTION_MODEL.md |
| Forbidden actions enforced | ✅ done | 2026-01-30 | Included in interaction model |
| No approval affordances | ✅ done | 2026-01-30 | Included in interaction model |

### Component C: Stage Separation ✅ COMPLETE
| Item | Status | Date | Notes |
|------|--------|------|-------|
| Separation rules documented | ✅ done | 2026-01-30 | STAGE3.1_STAGE_SEPARATION.md |
| No cross-stage objects | ✅ done | 2026-01-30 | Included in separation rules |
| Queue isolation verified | ✅ done | 2026-01-30 | No Stage 3 queue by design |

### Component D: Failure Detection ✅ COMPLETE
| Item | Status | Date | Notes |
|------|--------|------|-------|
| Failure signals documented | ✅ done | 2026-01-30 | STAGE3.1_FAILURE_SIGNALS.md |
| Kill-switch protocol defined | ✅ done | 2026-01-30 | Included in failure signals |

---

## References

- Stage 3 Kickoff: `STAGE3/STAGE3_AUTHORIZATION_KICKOFF.md`
- Stage 2.6 Closure: `STAGE2/STAGE2.6/STAGE2.6_CLOSURE_RECOMMENDATION.md`
