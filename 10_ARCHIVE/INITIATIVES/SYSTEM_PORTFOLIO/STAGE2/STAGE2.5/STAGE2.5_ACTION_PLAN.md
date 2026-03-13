---
id: 10_archive__initiatives__system_portfolio__stage2__stage2_5__stage2_5_action_plan_md
title: Stage 2.5 — Supervised Execution Kickoff
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Stage 2.5 — Supervised Execution Kickoff

## Status

- **Status:** KICKOFF COMPLETE (first execution successful)
- **Owner:** ML1
- **Effective Start:** 2026-01-30 (Stage 2.4 closed)
- **Kickoff Closed:** 2026-01-30
- **Authority Gate:** Explicit ML1 approval required per action

---

## Purpose

Authorize the system to perform limited, supervised actions based on validated inbox intelligence, while preserving:

- human-in-the-loop control,
- reversibility,
- auditability,
- and strict scope boundaries.

**Stage 2.5 answers:**

> "May the system act, if a human explicitly approves the action?"

---

## Preconditions (Hard Gates)

Stage 2.5 may not begin unless all are true:

- [x] Stage 2.3 pilot completed and archived
- [x] Stage 2.4 closed with ML1 "Proceed" determination (2026-01-30)
- [x] Taxonomy locked (Matters → Activity / Client; Operations → Inquiries / Fulfillment; etc.) — v1.3
- [x] Confidence thresholds approved — accepted as-is
- [x] Calibration log updated — classification_log.ndjson
- [x] SYS-005 confirms no unresolved governance issues — STAGE2.4_GOVERNANCE_REPORT.md
- [x] SYS-009 confirms documentation integrity — STAGE2.4_QA_REPORT.md

---

## Scope (Authorized)

Stage 2.5 is authorized to perform only the following, and only with ML1 approval per action:

### 1. Human-Approved Execution on Inbox Items

Act only on items that:

- were classified in 2.3+
- reviewed in 2.4
- explicitly approved by ML1

**No autonomous execution is allowed.**

### 2. Permitted Action Types (Initial Set)

Each action must be:

- discrete
- reversible
- logged

**Initial permitted actions:**

| Action | Description | Reversibility |
|--------|-------------|---------------|
| Move email | Move out of 09_INBOX into target system folder | Move back |
| Attach label/tag | Add system label or metadata tag | Remove tag |
| Create stub | Create placeholder artifact (Matter stub, Intake record) | Delete stub |
| Mark processed | Mark item as "processed" inside ML2 only | Unmark |

**Not permitted yet:**

- Replying to emails
- Sending messages
- Modifying external systems without confirmation
- Background or bulk execution

### 3. Approval Mechanism (Mandatory)

Every action requires:

1. **Proposed Action Object**, containing:
   - source item
   - proposed action
   - rationale
   - reversibility note

2. **Explicit ML1 approval signal**
   - checkbox, signature, or command

**No approval → no action.**

---

## Workstreams

### Workstream A — Action Proposal Layer

**Owner:** SYS-008

**Steps:**

1. [ ] Generate Action Proposal artifacts from Draft Placement Plans
2. [ ] Queue proposals for ML1 review
3. [ ] Do not execute

**Deliverables:**

- Action Proposal schema
- Proposal queue location

---

### Workstream B — Human Approval Interface

**Owner:** ML1 (with SYS-009 support)

**Steps:**

1. [ ] Define how approvals are given:
   - checklist
   - command
   - signed artifact
2. [ ] Define rejection / defer options

**Deliverables:**

- Approval template
- Approval log

---

### Workstream C — Execution Harness (Minimal)

**Owner:** SYS-007 + SYS-008

**Steps:**

1. [ ] Implement the smallest possible execution mechanism
2. [ ] One action at a time
3. [ ] Full logging
4. [ ] Immediate halt on error

**Deliverables:**

- Execution runbook
- Rollback procedure

---

### Workstream D — Audit & Governance

**Owner:** SYS-005

**Steps:**

1. [ ] Validate every execution event
2. [ ] Confirm:
   - approval existed
   - scope respected
   - reversibility preserved

**Deliverables:**

- Execution audit report
- Pass/fail per action

---

## Definition of Done (Stage 2.5 Kickoff) ✅ COMPLETE

Stage 2.5 kickoff is complete when:

- [x] Action Proposal schema exists — ACTION_PROPOSAL_SCHEMA.md
- [x] Approval mechanism defined and tested — ML1_APPROVAL_WORKSHEET.md
- [x] One (1) supervised action executed successfully — PROPOSAL-001
- [x] Action logged and auditable — execution_log.md Entry 001
- [x] Rollback tested — Verified (file deletion capability)
- [x] SYS-005 governance PASS — STAGE2.5_GOVERNANCE_REPORT.md
- [x] ML1 confirms comfort with the execution model — Approved first execution

---

## Explicit Non-Goals (Stage 2.5)

- ❌ No bulk automation
- ❌ No autonomous agents
- ❌ No background jobs
- ❌ No SharePoint / Word execution yet
- ❌ No SLA or performance targets

---

## Summary

Stage 2.5 is where the system learns how to act **with permission**, not how to act on its own.

---

## Execution Tracking

### Workstream A: Action Proposal Layer ✅ COMPLETE
| Item | Status | Date | Notes |
|------|--------|------|-------|
| Action Proposal schema | ✅ done | 2026-01-30 | ACTION_PROPOSAL_SCHEMA.md |
| Proposal queue location | ✅ done | 2026-01-30 | 09_INBOX/01_CLASSIFIED_PROPOSALS/ |

### Workstream B: Human Approval Interface ✅ COMPLETE
| Item | Status | Date | Notes |
|------|--------|------|-------|
| Approval mechanism defined | ✅ done | 2026-01-30 | Checkbox + notes |
| Rejection/defer options | ✅ done | 2026-01-30 | Three-way decision |
| Approval template | ✅ done | 2026-01-30 | ML1_APPROVAL_WORKSHEET.md |
| Approval log | ✅ done | 2026-01-30 | execution_log.md |

### Workstream C: Execution Harness ✅ COMPLETE
| Item | Status | Date | Notes |
|------|--------|------|-------|
| Execution mechanism | ✅ done | 2026-01-30 | SUPERVISED_EXECUTION_RUNBOOK.md |
| Logging implementation | ✅ done | 2026-01-30 | 06_RUNS/EXECUTION/execution_log.md |
| Halt on error | ✅ done | 2026-01-30 | Defined in runbook |
| Execution runbook | ✅ done | 2026-01-30 | SUPERVISED_EXECUTION_RUNBOOK.md |
| Rollback procedure | ✅ done | 2026-01-30 | ROLLBACK_PROCEDURE.md |

### Workstream D: Audit & Governance ✅ COMPLETE
| Item | Status | Date | Notes |
|------|--------|------|-------|
| Execution audit report | ✅ done | 2026-01-30 | STAGE2.5_GOVERNANCE_REPORT.md |
| Pass/fail per action | ✅ done | 2026-01-30 | PROPOSAL-001: PASS |

---

## References

- Stage 2.4 Readiness Determination: `STAGE2.4/STAGE2.4_READINESS_DETERMINATION.md`
- Taxonomy (v1.3): `02_PLAYBOOKS/core/inbox_triage/TAXONOMY.md`
- Classifier (v0.2): `scripts/inbox_classifier.py`
- Draft Placement Plans: `06_RUNS/INBOX_TRIAGE/pilot/pilot-2026-01-30-v2/placement_plans/`
- Action Proposal Schema: `02_PLAYBOOKS/_assets/execution/schemas/action_proposal_schema/README.md`
- ML1 Approval Worksheet: `02_PLAYBOOKS/_assets/execution/worksheets/ml1_approval_worksheet/README.md`
- Supervised Execution Runbook: `02_PLAYBOOKS/execution/supervised_execution_runbook/README.md`
- Rollback Procedure: `02_PLAYBOOKS/execution/rollback_procedure/README.md`
- Execution Log: `06_RUNS/EXECUTION/execution_log.md`
