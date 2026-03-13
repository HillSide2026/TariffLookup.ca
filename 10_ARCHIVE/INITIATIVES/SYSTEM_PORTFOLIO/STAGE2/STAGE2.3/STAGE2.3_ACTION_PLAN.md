---
id: 10_archive__initiatives__system_portfolio__stage2__stage2_3__stage2_3_action_plan_md
title: Stage 2.3 — Inbox Intelligence Layer: Action Plan
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Stage 2.3 — Inbox Intelligence Layer: Action Plan

## Status

- **Status:** COMPLETE ✅
- **Owner:** ML1
- **Execution Owners:** SYS-008 (Knowledge Curation) + SYS-005 (Governance) + SYS-009 (QA)
- **Precondition:** Phase 2.2.1 Gmail complete (read-only, audited, no-write)
- **Completed:** 2026-01-29

---

## Purpose

Build a deterministic, auditable inbox triage classifier that:

- reads Gmail messages (read-only),
- produces classification proposals,
- logs every decision,
- generates a Draft Placement Plan artifact for later automation.

**No movement. No external writes. Proposals only.**

---

## Scope

### In scope

- Define taxonomy (object types, lifecycle states, system domains)
- Implement classifier interface (inputs/outputs)
- Create Draft Placement Plan object schema
- Implement classification logging (append-only)
- Run pilot classification on a bounded message set

### Out of scope

- Moving messages, labeling, archiving, replying
- Writing to Gmail, SharePoint, Word, or any external system
- Automated scheduling/polling/background agents
- Matter/client-specific execution workflows

---

## Phase 2.3.1 — Define Triage Taxonomy

**Owner:** ML1 + SYS-008

### 2.3.1.1 Categories (Object Type)

- [ ] Legal matter email
- [ ] Client communication
- [ ] Vendor / billing
- [ ] Marketing
- [ ] System notification
- [ ] Noise

### 2.3.1.2 Lifecycle State

- [ ] Action required
- [ ] Waiting
- [ ] Reference
- [ ] Archive candidate

### 2.3.1.3 System Domain

- [ ] Matters
- [ ] Finance
- [ ] System operations
- [ ] Research
- [ ] Personal noise

### 2.3.1.4 Confidence Policy

- [ ] Define threshold bands (e.g., High / Medium / Low)
- [ ] Define Unknown / Needs human rule
- [ ] Define "minimum evidence" rule for non-Unknown classifications

**Deliverables:**

- `02_PLAYBOOKS/core/inbox_triage/TAXONOMY.md` (taxonomy + confidence rules)

---

## Phase 2.3.2 — Classifier Interface Spec

**Owner:** SYS-008 (draft) + SYS-009 (QA)

### Inputs (read-only)

- [ ] Subject
- [ ] Sender
- [ ] Snippet
- [ ] Labels (read-only)
- [ ] Timestamp
- [ ] Message ID (required)

### Outputs

- [ ] Category (object type)
- [ ] Lifecycle state
- [ ] System domain
- [ ] Confidence (0–1 or banded)
- [ ] Reason trace (short, bounded)
- [ ] Proposed destination root (repo path root only)

**Deliverables:**

- `02_PLAYBOOKS/core/inbox_triage/CLASSIFIER_INTERFACE.md`

---

## Phase 2.3.3 — Draft Placement Plan Schema

**Owner:** SYS-009 (schema draft) + SYS-005 (governance review)

### Draft Placement Plan object (proposal only)

**Required fields:**

- `message_id`
- `classification`
- `lifecycle_state`
- `system_domain`
- `confidence`
- `proposed_destination`
- `status` = `proposal_only`
- `timestamp`
- `model_version` (or ruleset version)

**Deliverables:**

- `00_SYSTEM/schemas/SCHEMAS_INBOX_TRIAGE.md`
- `03_TEMPLATES/INBOX_TRIAGE/DRAFT_PLACEMENT_PLAN.json` (example template)

---

## Phase 2.3.4 — Logging Spec and Append-Only Log

**Owner:** SYS-007 (integration boundary check) + SYS-009 (QA)

### Logging requirements

Log every classification decision:

- timestamp
- message id
- predicted class / state / domain
- confidence
- model/ruleset version
- minimal input evidence (subject/sender hash or redacted summary, if needed)

**Deliverables:**

- `02_PLAYBOOKS/core/inbox_triage/LOGGING_SPEC.md`
- Append-only log location (repo-local):
  - `06_RUNS/INBOX_TRIAGE/logs/classification_log.ndjson`

---

## Phase 2.3.5 — Pilot Run (Bounded)

**Owner:** SYS-008
**Validators:** SYS-005 + SYS-009

### Pilot constraints

- [ ] Bounded time window (e.g., last 7 days) OR bounded count (e.g., first 100 messages)
- [ ] No write operations to Gmail (verify allowlist/blocklist)
- [ ] Output proposals only

### Pilot steps

1. [ ] Pull message metadata via Gmail read-only module
2. [ ] Run classifier for each message
3. [ ] Write Draft Placement Plan objects (one per message)
4. [ ] Append to classification log
5. [ ] Produce pilot summary report (counts by class, Unknown rate, confidence distribution)

**Deliverables:**

- `06_RUNS/INBOX_TRIAGE/pilot/YYYY-MM-DD/placement_plans/` (proposal objects)
- `06_RUNS/INBOX_TRIAGE/pilot/YYYY-MM-DD/pilot_summary.md`
- Updated `classification_log.ndjson`

---

## Governance & QA (Required Gates)

### SYS-005 System Governance

- [ ] Confirms no-write-path remains intact
- [ ] Confirms no movement/execution is occurring
- [ ] Confirms artifacts placed in correct directories
- [ ] Issues pass/fail for Phase 2.3 pilot

### SYS-009 Runbook & QA

- [ ] Validates schema compliance for Draft Placement Plan objects
- [ ] Validates report format and required sections
- [ ] Confirms no secrets and no raw credential leakage in logs/reports

---

## Definition of Done (Stage 2.3) ✅ ALL COMPLETE

- [x] Taxonomy defined and published
- [x] Classifier interface spec published
- [x] Draft Placement Plan schema published
- [x] Logging spec published and append-only log created
- [x] Pilot run completed on bounded set (100 messages, 2026-01-29)
- [x] Pilot outputs produced (plans + logs + summary)
- [x] SYS-005 governance PASS (2026-01-29)
- [x] SYS-009 QA PASS (2026-01-29)

---

## Immediate Next Actions (No dependencies)

1. Draft and approve `TAXONOMY.md` (Phase 2.3.1)
2. Draft `CLASSIFIER_INTERFACE.md` (Phase 2.3.2)
3. Add Draft Placement Plan schema to schemas (Phase 2.3.3)
4. Define log format + location (Phase 2.3.4)
5. Run bounded pilot (Phase 2.3.5)

---

## Execution Tracking

### Phase 2.3.1: Define Triage Taxonomy ✅ COMPLETE
| Item | Status | Date | Notes |
|------|--------|------|-------|
| Categories defined | ✅ done | 2026-01-28 | 6 object types |
| Lifecycle states defined | ✅ done | 2026-01-28 | 4 states |
| System domains defined | ✅ done | 2026-01-28 | 5 domains |
| Confidence policy defined | ✅ done | 2026-01-28 | High/Medium/Low thresholds |
| TAXONOMY.md published | ✅ done | 2026-01-28 | 02_PLAYBOOKS/core/inbox_triage/TAXONOMY.md |

### Phase 2.3.2: Classifier Interface Spec ✅ COMPLETE
| Item | Status | Date | Notes |
|------|--------|------|-------|
| Inputs defined | ✅ done | 2026-01-28 | 6 required inputs |
| Outputs defined | ✅ done | 2026-01-28 | 10 required outputs |
| CLASSIFIER_INTERFACE.md published | ✅ done | 2026-01-28 | 02_PLAYBOOKS/core/inbox_triage/CLASSIFIER_INTERFACE.md |

### Phase 2.3.3: Draft Placement Plan Schema ✅ COMPLETE
| Item | Status | Date | Notes |
|------|--------|------|-------|
| Schema defined | ✅ done | 2026-01-28 | 9 required fields |
| SCHEMAS_INBOX_TRIAGE.md published | ✅ done | 2026-01-28 | 00_SYSTEM/schemas/SCHEMAS_INBOX_TRIAGE.md |
| Example template created | ✅ done | 2026-01-28 | 03_TEMPLATES/INBOX_TRIAGE/DRAFT_PLACEMENT_PLAN.json |

### Phase 2.3.4: Logging Spec ✅ COMPLETE
| Item | Status | Date | Notes |
|------|--------|------|-------|
| Log format defined | ✅ done | 2026-01-28 | NDJSON, append-only |
| LOGGING_SPEC.md published | ✅ done | 2026-01-28 | 02_PLAYBOOKS/core/inbox_triage/LOGGING_SPEC.md |
| Log directory created | ✅ done | 2026-01-28 | 06_RUNS/INBOX_TRIAGE/logs/ |

### Phase 2.3.5: Pilot Run ✅ COMPLETE
| Item | Status | Date | Notes |
|------|--------|------|-------|
| PILOT_RUN.md published | ✅ done | 2026-01-28 | 02_PLAYBOOKS/core/inbox_triage/PILOT_RUN.md |
| Pilot constraints confirmed | ✅ done | 2026-01-29 | 100 messages, run_id=pilot-2026-01-29 |
| Messages pulled | ✅ done | 2026-01-29 | 100 messages via Gmail read-only |
| Classification run | ✅ done | 2026-01-29 | inbox-triage-v0.1, 100% classified |
| Placement plans generated | ✅ done | 2026-01-29 | 100 plans in 06_RUNS/INBOX_TRIAGE/pilot/ |
| Summary report produced | ✅ done | 2026-01-29 | pilot_summary.md |
| SYS-005 governance pass | ✅ PASS | 2026-01-29 | STAGE2.3_GOVERNANCE_REPORT.md |
| SYS-009 QA pass | ✅ PASS | 2026-01-29 | STAGE2.3_QA_REPORT.md |

---

## References

- Stage 2 Authorization: `01_ACTIVE_ROADMAPS/STAGE2/STAGE2_AUTHORIZATION_KICKOFF.md`
- Gmail Integration (Phase 2.2.1): `01_ACTIVE_ROADMAPS/STAGE2/STAGE2.2/STAGE2.2_ACTION_PLAN.md`
- Gmail Module: `scripts/gmail_integration.py`
- Write-Back Policy: `01_DOCTRINE/02_policies/WRITE_BACK_POLICY.md`

---

## QC Review Notes (2026-01-28)

**Reviewer:** Claude (on behalf of ML1)

### Assessment: APPROVED with minor observations

**Strengths:**

1. Clear purpose statement with explicit "No movement. No external writes. Proposals only." constraint
2. Well-structured phases with clear ownership assignments
3. Specific deliverables listed for each phase
4. Governance gates properly defined (SYS-005 and SYS-009)
5. Clear Definition of Done criteria
6. Consistent with read-only doctrine from Stage 2.2
7. Appropriate precondition (Phase 2.2.1 Gmail complete)

**Observations (for ML1 consideration):**

1. **Taxonomy completeness**: Consider whether an "Other/Uncategorized" catch-all is needed for edge cases
2. **Confidence thresholds**: Phase 2.3.1.4 mentions bands but leaves numeric ranges TBD — this is appropriate (ML1 decision)
3. **Pilot scope**: "First 100 messages" vs "last 7 days" — recommend picking one for consistency during actual execution
4. **Schema location**: Phase 2.3.3 offers choice between standalone `SCHEMAS_INBOX_TRIAGE.md` vs appending to existing `SCHEMAS.md` — recommend standalone for modularity

**Structural additions made:**

- Added Execution Tracking tables (consistent with Stage 2.2 format)
- Added References section

**Status:** Ready for Phase 2.3.1 content when provided by ML1.
