---
id: 04_initiatives__system_portfolio__01_active_roadmaps__stage3__stage3_authorization_kickoff_md
title: Stage 3 — Authorization Kickoff
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-12
tags: []
---

# Stage 3 — Authorization Kickoff

## Cognitive & Communication Scaffolding (With Agents, No Authority)

---

## Status

- **Status:** AUTHORIZED
- **Owner:** ML1
- **Effective Start:** 2026-01-30 (Stage 2.6 closed)
- **Authority Gate:** Sub-stage exit gates required

---

## 1. Stage 3 Purpose (Re-anchored)

Stage 3 is **not about delegation**.
It is about reducing friction in thinking and communication while keeping authorship, judgment, and execution entirely with ML1.

**Stage 3 answers:**

> Can the system reliably generate scaffolding (structure, coverage, compression) that makes ML1 think and communicate faster — without becoming a writer, advisor, or actor?

**If the system ever feels like it is speaking for you, Stage 3 has failed.**

Stage 3 must remain:
- **Non-executing**
- **Non-authoritative**
- **Non-writing (no external/system-of-record writes)**
- **Non-policy-creating**
- **ML1-dependent for any external impact**

Internal-only drafts are permitted in Stage 3.6, but **must never propagate** to external systems.

---

## 2. Stage 3 Entry Conditions (Must Be True Before Starting)

Stage 3 should not begin unless:

- [x] Stage 2.x queues and approvals are stable
- [x] There is no ambiguity between "proposal" (Stage 2) and "scaffolding" (Stage 3)
- [x] ML1 explicitly accepts:
  - No approval semantics for Stage 3 outputs
  - No downstream execution
  - No memory across sessions

**Stage 3 is a different mental mode.**

---

## 3. Stage 3 Operating Model (Critical)

### Interaction Contract

All Stage 3 outputs support only three actions:

- **use**
- **ignore**
- **delete**

There is:
- ❌ no approve
- ❌ no accept
- ❌ no queue
- ❌ no execution

### Authorship Contract

Every artifact is:
- explicitly labeled
- unmistakably system-generated
- never confused with ML1-authored material

---

## 4. Stage 3 Sub-Stage Breakdown (Operational)

### Stage 3.1 — Foundation & Guardrails

**Objective:** Make misuse impossible before capability expansion.

**Work to Do:**
- [ ] Implement automatic labeling:
  - "System-generated outline"
  - "System-generated coverage list"
  - "System-generated summary"
- [ ] Enforce interaction model (use / ignore / delete)
- [ ] Hard separation from Stage 2.x:
  - No proposals
  - No queue
  - No persistence as "work items"
- [ ] Define failure signals:
  - "Feels send-ready"
  - "Light edits then shipped"
  - "Forgot who wrote this"

**Agents:** ❌ None

**Exit Gate:**
- Zero ambiguity about authorship
- Zero temptation to approve
- Clear mental separation from Stage 2.x

---

### Stage 3.2 — Outlines & Structural Skeletons

**Objective:** Help ML1 start faster without drafting content.

**Allowed Output:**
- Headers
- Section ordering
- Placeholders
- Explicit "insert judgment here" markers

**Constraints:**
- Headers > paragraphs
- Placeholders > prose
- No sentences intended for reuse

**Agents Introduced:**
- Email Structurer
- Document Structurer

**Agent Definition (Both):**
- Stateless
- On-demand only
- Generates structure, not language
- No memory
- No execution

**Example Uses:**
- Outline an email explaining a delay
- Skeleton for a memo or update
- Structure for an internal explanation

**Exit Gate:**
- ML1 consistently rewrites everything
- Output speeds starting, not finishing
- No "this is almost done" feeling

---

### Stage 3.3 — Coverage & Brainstorm Lists

**Objective:** Reduce omission risk without injecting judgment.

**Allowed Output:**
- Points to cover
- Questions to answer
- Risks to flag
- Follow-ups
- Likely misunderstandings

**Constraints:**
- List form only
- No prioritization unless explicitly requested
- No recommendations
- No narrative framing

**Agents Introduced:**
- Issue Spotter
- Communication Coverage Assistant
- Corporate Law Issue Spotter

**Corporate Law Agent (Important Framing):**
- Issue-spotting only
- Checklist mindset
- No advice, conclusions, or likelihoods

**Exit Gate:**
- Lists feel optional, not directive
- Ignoring items feels safe
- No sense of "the system knows better"

---

### Stage 3.4 — Neutral Summaries

**Objective:** Compress context without interpretation.

**Allowed Output:**
- Summaries of:
  - email threads
  - conversations
  - documents
  - timelines / chronologies

**Constraints:**
- Source-bound
- No inference
- No synthesis beyond compression
- Reconstructable from original material

**Agents Introduced:**
- Conversation Summarizer
- Document Condenser

**Exit Gate:**
- Saves rereading time
- Errors are obvious
- Authority remains clearly with source material

---

### Stage 3.5 — Framing Variants (Optional, Narrow)

**Objective:** Help choose *how* to communicate, not *what* to say.

**Allowed Output:**
- Bullet-level framing options:
  - direct
  - empathetic
  - procedural
  - informational

**Constraints:**
- Bullets only
- No wording
- No preferred option unless requested
- No recommendation language or implied authority
- Must label uncertainty explicitly

**Agent Introduced:**
- Communication Framing Assistant

**Deliverables:**
- **Framing Variant Schema v1.0** (per-variant fields):
  - Framing lens (e.g., risk-minimizing, aggressive, conservative, client-centered, precedent-driven)
  - Core thesis
  - Key implications
  - Assumptions
  - Hidden tradeoffs
  - What this framing deprioritizes
- **Variant Comparison Matrix** (structured table):
  - Stability
  - Risk exposure
  - Operational load
  - Reversibility
  - Escalation likelihood

**Exit Gate:**
- Aids approach selection
- Does not tempt verbatim reuse
- Roll back immediately if it feels like drafting

---

### Stage 3.6 — Draft Responses (Internal Only)

**Objective:** Provide draft response starting points without exporting to Gmail, inbox, or any external system.

**Allowed Output:**
- Draft response options (internal only)
- Clearly labeled system-generated drafts

**Constraints:**
- No export to Gmail or inbox
- No external writes
- No send-ready wording
- Use / Ignore / Delete only

**Agent Introduced:**
- Draft Response Assistant

**Deliverables:**
- **Draft Classification Layer** (all drafts tagged):
  - Internal Draft — No Distribution
  - Draft for ML1 Revision
  - Draft Requires Substantive Legal Judgment
  - Draft Structurally Complete — Substantive Review Needed
- **Draft Construction Protocol** (each draft logs):
  - Source artifacts referenced
  - Applied doctrine
  - Open assumptions
  - Missing information
  - Confidence band
- **No-Propagation Enforcement** (hard rule):
  - Drafts cannot be auto-sent
  - Drafts cannot be auto-inserted into external systems
  - Drafts cannot mutate system memory

**Exit Gate:**
- Drafts speed starting but never feel send-ready
- All drafts remain local and labeled
- Any export attempt triggers immediate stop

---

### Stage 3.7 — Cognitive Consistency Checks (Read-Only)

**Objective:** Surface contradictions or drift before authority elevation.

**Allowed Output:**
- Flags only (no resolution, no recommendations)

**System Flags:**
- Contradictory doctrine references
- Outdated template usage
- Inconsistent framing
- Coverage gaps

**Constraints:**
- Read-only, non-authoritative
- Surfaces inconsistencies but does not resolve them
- No policy creation

**Agent Introduced:**
- Cognitive Consistency Checker

**Exit Gate:**
- Conflict & drift surfacing is reliable and non-invasive
- No attempts to resolve or override ML1 judgment

---

### Stage 3.8 — Consistency Metric Development

**Objective:** Define a read-only consistency metric for internal outputs without creating authority or enforcement.

**Allowed Output:**
- Metric spec
- Scoring worksheet
- Baseline sampling protocol

**Constraints:**
- Read-only analysis only
- No recommendations or prescriptions
- No enforcement or gating

**Deliverables:**
- `CONSISTENCY_METRIC_SPEC.md`
- `CONSISTENCY_METRIC_WORKSHEET.md`

**Exit Gate:**
- Metric dimensions and rubric defined
- Worksheet ready for use
- Baseline sampling protocol documented

---

### Stage 3.9 — Consistency Metric Validation

**Objective:** Validate the consistency metric across a baseline sample set without authority creep.

**Allowed Output:**
- Test report
- Calibration notes

**Constraints:**
- Read-only analysis only
- No recommendations or prescriptions
- No enforcement or gating

**Deliverables:**
- `CONSISTENCY_METRIC_TEST_REPORT.md`

**Exit Gate:**
- Metric applied to baseline set
- Variance within tolerance
- Thresholds documented

## 5. Agent Summary (Stage 3)

| Agent | Sub-Stage | Function | Ceiling |
|-------|-----------|----------|---------|
| Email Structurer | 3.2 | Structure emails | No prose |
| Document Structurer | 3.2 | Structure docs | No prose |
| Issue Spotter | 3.3 | Surface issues | No judgment |
| Comm Coverage Assistant | 3.3 | Avoid omission | Lists only |
| Corporate Law Issue Spotter | 3.3 | Legal issue spotting | No advice |
| Conversation Summarizer | 3.4 | Compress threads | No inference |
| Document Condenser | 3.4 | Compress docs | No synthesis |
| Comm Framing Assistant | 3.5 | Approach options | No wording |
| Draft Response Assistant | 3.6 | Internal drafts | No export |
| Cognitive Consistency Checker | 3.7 | Drift surfacing | No resolution |
| Consistency Metric Analyst | 3.8 | Define metric | No enforcement |
| Consistency Metric Validator | 3.9 | Validate metric | No enforcement |

**All agents are:**
- stateless
- on-demand
- non-authoritative
- non-executing

---

## 6. Failure Signals (Immediate Stop)

If any of these appear, Stage 3 pauses:

- [ ] You send something with only light edits
- [ ] You feel tempted to "approve" text
- [ ] You forget whether wording is yours
- [ ] The system sounds confident
- [ ] You feel slower, not faster

---

## 7. Relationship to Stage 2.x

| Stage 2.x | Stage 3 |
|-----------|---------|
| Operational trust | Cognitive leverage |
| Proposals → Approval → Execution | Scaffolding → Rewrite → Use/Ignore/Delete |
| Queue-based | Stateless, on-demand |
| System acts (with permission) | System surfaces (no authority) |

**Stage 3 outputs never enter:** queues, proposals, approval workflows.

They live in a different mental and system bucket.

---

## 8. Execution Tracking

### Stage 3.1 — Foundation & Guardrails ✅ COMPLETE
| Item | Status | Date | Notes |
|------|--------|------|-------|
| Artifact labeling schema | ✅ done | 2026-01-30 | v3 labeling |
| Interaction model enforcement | ✅ done | 2026-01-30 | Use/Ignore/Delete only |
| Stage 2.x/3 separation rules | ✅ done | 2026-01-30 | No queue, no approval |
| Failure signal checklist | ✅ done | 2026-01-30 | Documented |

### Stage 3.2 — Outlines & Structural Skeletons ✅ COMPLETE
| Item | Status | Date | Notes |
|------|--------|------|-------|
| Email Structurer agent | ✅ done | 2026-01-30 | Spec + playbook |
| Document Structurer agent | ✅ done | 2026-01-30 | Spec + playbook |
| Exit gate validation | ✅ done | 2026-01-30 | ML1 confirmed |

### Stage 3.3 — Coverage & Brainstorm Lists ✅ COMPLETE
| Item | Status | Date | Notes |
|------|--------|------|-------|
| Issue Spotter agent | ✅ done | 2026-01-30 | 3/3 tests pass |
| Communication Coverage Assistant | ✅ done | 2026-01-30 | 3/3 tests pass |
| Corporate Law Issue Spotter | ✅ done | 2026-01-30 | 3/3 tests pass, Ontario/OBCA tuned |
| Exit gate validation | ✅ done | 2026-01-30 | ML1 confirmed |

### Stage 3.4 — Neutral Summaries ✅ COMPLETE
| Item | Status | Date | Notes |
|------|--------|------|-------|
| Conversation Summarizer agent | ✅ done | 2026-01-31 | 5/5 tests pass |
| Document Condenser agent | ✅ done | 2026-01-31 | 1/3 core test pass |
| Timeline mode | ✅ done | 2026-01-31 | 1/2 core test pass |
| Exit gate validation | ✅ done | 2026-01-31 | ML1 confirmed |

### Stage 3.5 — Framing Variants (Optional) ✅ COMPLETE
| Item | Status | Date | Notes |
|------|--------|------|-------|
| Communication Framing Assistant | ✅ done | 2026-02-11 | 3/3 tests pass |
| Exit gate validation | ✅ done | 2026-02-11 | ML1 confirmed |

### Stage 3.6 — Draft Responses (Internal Only) ✅ COMPLETE
| Item | Status | Date | Notes |
|------|--------|------|-------|
| Draft Response Assistant | ✅ done | 2026-02-11 | Phase 2 + tests logged |
| Exit gate validation | ✅ done | 2026-02-11 | ML1 confirmed |

### Stage 3.7 — Cognitive Consistency Checks ✅ COMPLETE
| Item | Status | Date | Notes |
|------|--------|------|-------|
| Cognitive Consistency Checker | ✅ done | 2026-02-11 | Tests logged |
| Exit gate validation | ✅ done | 2026-02-11 | ML1 confirmed |

---

### Stage 3.8 — Consistency Metric Development 🔄 IN PROGRESS
| Item | Status | Date | Notes |
|------|--------|------|-------|
| Consistency metric spec | ✅ done | 2026-02-12 | `CONSISTENCY_METRIC_SPEC.md` |
| Scoring worksheet | ✅ done | 2026-02-12 | `CONSISTENCY_METRIC_WORKSHEET.md` |
| Draft promotion control doctrine | ✅ done | 2026-02-12 | `STAGE3.8_DRAFT_DOCTRINE_SB_EXECUTION_PROMOTION_CONTROL.md` |
| Draft SharePoint trigger spec | ✅ done | 2026-02-12 | `STAGE3.8_DRAFT_SPEC_SHAREPOINT_METADATA_PROMOTION_TRIGGER.md` |
| Exit gate validation | ⬜ pending | | |

### Stage 3.9 — Consistency Metric Validation 🟨 BACKLOG
| Item | Status | Date | Notes |
|------|--------|------|-------|
| Metric test report | ⬜ pending | | `CONSISTENCY_METRIC_TEST_REPORT.md` |
| Exit gate validation | ⬜ pending | | |

---

## Stage 3 Backlog Notes

- Untracked scripts present in repo: `00_SYSTEM/scripts/run_draft_response.py`, `00_SYSTEM/scripts/push_drafts_to_sheets.py` (pre-existing; left untouched). Decide whether to adopt, relocate, or archive.

## 9. Definition of Done (Stage 3)

Stage 3 is complete when:

- [ ] Draft generation is consistent
- [ ] Framing variants are balanced and neutral
- [ ] Conflict surfacing works (read-only, no resolution)
- [ ] Guardrails are not being triggered frequently
- [ ] ML1 review time decreases measurably (not bypassed)
- [ ] No unauthorized outputs have occurred
- [ ] All sub-stage exit gates passed
- [ ] ML1 confirms: "I think faster, I communicate faster, I do not trust the system"
- [ ] SMA-001 governance PASS
- [ ] SMA-005 QA PASS

---

## 10. References

- Stage 2.6 Closure: `STAGE2/STAGE2.6/STAGE2.6_CLOSURE_RECOMMENDATION.md`
- Classifier (v0.3): `00_SYSTEM/scripts/inbox_classifier.py`
- Calibration Log: `02_PLAYBOOKS/_assets/execution/log_formats/calibration_log/README.md`
