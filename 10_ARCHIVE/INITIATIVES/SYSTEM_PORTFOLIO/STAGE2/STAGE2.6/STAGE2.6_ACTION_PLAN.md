---
id: 10_archive__initiatives__system_portfolio__stage2__stage2_6__stage2_6_action_plan_md
title: Stage 2.6 — Batch Review & Queue Architecture
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Stage 2.6 — Batch Review & Queue Architecture

## Status

- **Status:** CLOSED
- **Owner:** ML1
- **Effective Start:** 2026-01-30 (Stage 2.5 kickoff closed)
- **Closure Date:** 2026-01-30
- **Authority Gate:** Explicit ML1 approval required

---

## Purpose

**Stage 2.6 Question:**

> "Can ML2 reliably prepare and queue multiple actionable proposals such that ML1 can review, approve, or reject them in batches — without loss of control, trust, or inspectability?"

This stage is **not about execution power**.
It is about **preparing work well enough that ML1 wants to approve it**.

---

## Preconditions (Hard Gates)

Stage 2.6 may not begin unless all are true:

- [x] Stage 2.5 kickoff complete — first execution successful
- [x] Proposal schema validated — ACTION_PROPOSAL_SCHEMA.md
- [x] Approval mechanism tested — APPROVAL-001 executed
- [x] Execution logging operational — execution_log.md
- [x] SYS-005 governance PASS on 2.5
- [x] SYS-009 QA PASS on 2.5

---

## Non-Negotiable Constraints (Reconfirmed)

These are guardrails, not suggestions:

### Explicitly In Scope

- Human review as the sole approval mechanism
- Persistent proposal queue
- Batch review (multiple proposals at once)
- Expanded proposal types (still low-risk)
- Learning feedback loops (classifier calibration)

### Explicitly Out of Scope

- ❌ Autonomous execution
- ❌ Scheduled/background jobs
- ❌ Auto-approval or silent defaults
- ❌ Bulk execution without review
- ❌ External writes beyond Gmail labels
- ❌ Any LL-facing outputs without ML1 approval

**This stage must fail safely.**

---

## Success Definition (Stage Exit Criteria)

Stage 2.6 is successful if ML1 can truthfully say:

> "I trust the system to prepare work for me at scale — and I feel in control reviewing it."

**Concrete signals:**

- ML1 prefers batch review over single-item review
- Rejections feel cheap, not frustrating
- Nothing "slips through"
- System state is always inspectable after the fact

---

## Workstreams

### Workstream A — Proposal Queue Architecture

**Objective:** Create a persistent, inspectable queue of proposed actions that survives time, interruptions, and re-review.

**Design Principles:**

- Queue is data, not UI state
- Every proposal is: addressable, reviewable, archivable
- Nothing is ephemeral

**Core Artifacts:**

1. **Proposal Record Schema**
   - ID
   - Source (email, site, system inference)
   - Proposed Action(s)
   - Confidence / classifier signal
   - Rationale (why this was proposed)
   - Status: pending | approved | rejected | deferred
   - ML1 decision metadata (who, when)

2. **Queue Storage**
   - File-backed (markdown / JSON, but inspectable)
   - Append-only decision log

**Validation Questions:**

- Can ML1 leave proposals untouched for days?
- Can ML1 revisit a rejected item and understand why it was rejected?
- Is there ever ambiguity about "what is pending"?

**Deliverables:**

- [ ] Proposal Record Schema (v2)
- [ ] Queue storage format specification
- [ ] Queue index/manifest file

---

### Workstream B — Batch Review UX & Ritual

**Objective:** Enable ML1 to review many proposals at once without cognitive overload.

**Batch Review Mechanics:**

Proposals grouped by:
- Type (Inquiry, Admin, Noise)
- Confidence band
- Source domain (e.g., soulpepper.com)

Review actions:
- Approve
- Reject
- Defer
- Add note (optional)

**Explicit Non-Goal:** This is not about a slick UI. This is about **decision throughput with clarity**.

**Review Cadence (Human-Controlled):**

ML1 chooses cadence:
- Daily
- Weekly
- "When I feel like it"

System never pressures review.

**Validation Signals:**

- ML1 can approve/reject 10–20 proposals faster than 1–2 today
- ML1 feels less interrupted, not more
- Review sessions feel intentional, not reactive

**Deliverables:**

- [ ] Batch review worksheet template
- [ ] Grouping logic documented
- [ ] Review ritual documented

---

### Workstream C — Expanded Action Types (Still Safe)

**Objective:** Test whether the queue model holds as actions become slightly more complex.

**Allowed Actions in Stage 2.6:**

| Action | Description | Reversibility |
|--------|-------------|---------------|
| Gmail label | Apply label to message | Remove label |
| Matter stub | Create draft-only placeholder | Delete stub |
| Status tag | Mark as Inquiry / Not Inquiry | Remove tag |
| Classification note | Add internal note | Delete note |

**Action Representation Rule:**

Every proposal must answer:
- What will change?
- Where will it change?
- Is this reversible?

**If reversibility is unclear → action not allowed.**

**Deliverables:**

- [ ] Action taxonomy (allowed / disallowed)
- [ ] Reversibility verification checklist

---

### Workstream D — Classifier Calibration Loop

**Objective:** Turn ML1's decisions into system learning, without autonomy.

**Calibration Mechanics:**

Every ML1 decision feeds:
- Classifier confidence adjustment
- Domain-level rules (e.g., soulpepper.com → Inquiry)

**No rule becomes "hard" without ML1 approval.**

**Artifacts Produced:**

- **Calibration Log**
  - Observation
  - ML1 decision
  - Proposed adjustment
  - Approved / rejected

**Key Rule:**

> ML2 may propose new heuristics.
> ML1 is the only entity that ratifies them.

**Validation Signal:**

- Over time, proposal quality improves
- Fewer obvious rejects
- No "mystery logic"

**Deliverables:**

- [ ] Calibration log template
- [ ] Heuristic proposal format
- [ ] Ratification workflow

---

### Workstream E — Trust, Audit, and Failure Modes

**Objective:** Ensure the system is boring under stress.

**Required Failure Behaviors:**

- If uncertain → propose, don't act
- If conflicted → surface ambiguity explicitly
- If broken → stop queue growth, not approvals

**Audit Guarantees:**

At any point, ML1 can answer:
- What did the system suggest?
- What did I approve?
- What changed as a result?
- What rule caused this suggestion?

**Red Flags to Watch:**

- ML1 hesitates because they "don't fully get" a proposal
- ML1 feels the need to spot-check external systems
- Decisions feel rushed or coerced

**If any appear → stage pauses.**

**Deliverables:**

- [ ] Trust & failure-mode checklist
- [ ] Audit query reference
- [ ] Pause criteria documented

---

## Definition of Done (Stage 2.6)

Stage 2.6 is complete when:

- [x] Proposal schema (v2) exists — `PROPOSAL_SCHEMA_V2.md`
- [x] Queue storage format validated — `QUEUE_STORAGE_FORMAT.md`
- [x] Batch review flow documented and tested — BATCH-20260130-001, BATCH-20260130-002 completed
- [x] Action taxonomy defined (allowed / disallowed) — `ACTION_TAXONOMY.md`
- [x] Calibration log template operational — 5 rules logged, approved (4 implemented, 1 pending)
- [x] Trust & failure-mode checklist complete — `FAILURE_MODES.md`
- [x] ML1 confirms: "I trust the system to prepare work at scale" — 2026-01-30
- [x] SYS-005 governance PASS — implicit via batch reviews
- [x] SYS-009 QA PASS — 90% accuracy on BATCH-002

---

## Explicit Output Label

> "Stage 2.6 validated: system can prepare work for ML1 review at scale, with human control preserved."

**No LL-facing execution is authorized at this stage.**

---

## Execution Tracking

### Workstream A: Proposal Queue Architecture ✅ COMPLETE
| Item | Status | Date | Notes |
|------|--------|------|-------|
| Proposal Record Schema v2 | ✅ done | 2026-01-30 | PROPOSAL_SCHEMA_V2.md |
| Queue storage format | ✅ done | 2026-01-30 | QUEUE_STORAGE_FORMAT.md |
| Queue index/manifest | ✅ done | 2026-01-30 | queue_manifest.json |

### Workstream B: Batch Review UX & Ritual ✅ COMPLETE
| Item | Status | Date | Notes |
|------|--------|------|-------|
| Batch review worksheet | ✅ done | 2026-01-30 | BATCH_REVIEW_WORKSHEET.md |
| Grouping logic | ✅ done | 2026-01-30 | GROUPING_LOGIC.md |
| Review ritual doc | ✅ done | 2026-01-30 | REVIEW_RITUAL.md |

### Workstream C: Expanded Action Types ✅ COMPLETE
| Item | Status | Date | Notes |
|------|--------|------|-------|
| Action taxonomy | ✅ done | 2026-01-30 | ACTION_TAXONOMY.md |
| Reversibility checklist | ✅ done | 2026-01-30 | Included in ACTION_TAXONOMY.md |

### Workstream D: Classifier Calibration Loop ✅ COMPLETE
| Item | Status | Date | Notes |
|------|--------|------|-------|
| Calibration log template | ✅ done | 2026-01-30 | CALIBRATION_LOG.md |
| Heuristic proposal format | ✅ done | 2026-01-30 | Included in CALIBRATION_LOG.md |
| Ratification workflow | ✅ done | 2026-01-30 | Included in CALIBRATION_LOG.md |

### Workstream E: Trust, Audit, and Failure Modes ✅ COMPLETE
| Item | Status | Date | Notes |
|------|--------|------|-------|
| Failure-mode checklist | ✅ done | 2026-01-30 | FAILURE_MODES.md |
| Audit query reference | ✅ done | 2026-01-30 | Included in FAILURE_MODES.md |
| Pause criteria | ✅ done | 2026-01-30 | Included in FAILURE_MODES.md |

### Validation: Test Batch ✅ COMPLETE
| Item | Status | Date | Notes |
|------|--------|------|-------|
| Generate test batch | ✅ done | 2026-01-30 | BATCH-20260130-001 (10 proposals) |
| ML1 batch review | ✅ done | 2026-01-30 | 8 rejected, 2 deferred — calibration feedback |
| Calibration rules | ✅ done | 2026-01-30 | 4 rules implemented in v0.3 |
| Verification pilot | ✅ done | 2026-01-30 | pilot-2026-01-30-v3, all rules verified |

### Calibration Observations Applied
| OBS ID | Issue | Resolution | Verified |
|--------|-------|------------|----------|
| OBS-20260130-001 | soulpepper.com → System Notification | Now → Inquiries (CRM sender) | ✓ |
| OBS-20260130-002 | barberismo.com → Inquiries | Now → Noise | ✓ (17% Noise) |
| OBS-20260130-003 | Zoom Clips → Vendors | Now → Fulfillment | ✓ (5% Fulfillment) |
| OBS-20260130-004 | .gc.ca consultations → Inquiries | Now → Promotions | ✓ (3% Promotions) |

---

## References

- Stage 2.5 Action Plan: `STAGE2.5/STAGE2.5_ACTION_PLAN.md`
- Stage 2.5 Governance Report: `STAGE2.5/STAGE2.5_GOVERNANCE_REPORT.md`
- Action Proposal Schema (v1): `02_PLAYBOOKS/_assets/execution/schemas/action_proposal_schema/README.md`
- Execution Log: `06_RUNS/EXECUTION/execution_log.md`
- Taxonomy (v1.3): `02_PLAYBOOKS/core/inbox_triage/TAXONOMY.md`
