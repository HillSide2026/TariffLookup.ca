---
id: 10_archive__initiatives__system_portfolio__stage3__stage3_4__stage3_4_action_plan_md
title: Stage 3.4 — Neutral Summaries
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Stage 3.4 — Neutral Summaries

## Status

- **Status:** ✅ COMPLETE
- **Owner:** ML1
- **Effective Start:** 2026-01-30 (Stage 3.3 closed)
- **Testing Completed:** 2026-01-31
- **Closed:** 2026-01-31
- **Authority Gate:** Exit criteria met — Stage 3.5 authorized

---

## Stage 3.4 Core Question

> Can the system compress context without interpretation?

**Stage 3.4 succeeds if summaries save rereading time while authority remains with the source.**
Its job is to compress, not to interpret.

---

## 1. Scope Definition

### In-Scope (Compression Only)

| Output Type | Purpose |
|-------------|---------|
| Email thread summaries | Compress multi-message threads |
| Conversation summaries | Capture what was discussed |
| Document summaries | Compress long documents |
| Timelines / chronologies | Order events without interpretation |

### Out-of-Scope

| Element | Why Excluded |
|---------|--------------|
| Interpretive language | Adds meaning not in source |
| Conclusions or implications | Inference territory |
| Recommendations | Creates authority |
| Tone shaping | Characterization without basis |
| Cross-source synthesis | Combining sources adds interpretation |
| Omitted uncertainty | Must flag what's unclear |

---

## 2. Agents Introduced

### Agent 1: Conversation Summarizer

**Function:** Compress multi-message threads or discussions
**Output:** Neutral summary, timeline (optional)
**Ceiling:** No inference, no synthesis across speakers, no conclusions

See: `04_INITIATIVES/SYSTEM_PORTFOLIO/01_ACTIVE_ROADMAPS/STAGE3/PLAYBOOKS/CONVERSATION_SUMMARIZER.md`

### Agent 2: Document Condenser

**Function:** Compress long documents into neutral summaries
**Output:** Section-by-section compression, bullet summaries
**Ceiling:** No synthesis across sections, no inferred intent

See: `04_INITIATIVES/SYSTEM_PORTFOLIO/01_ACTIVE_ROADMAPS/STAGE3/PLAYBOOKS/DOCUMENT_CONDENSER.md`

---

## 3. Hard Constraints

All Stage 3.4 outputs must be:

- [x] Source-bound: every point traceable to source (validated in tests)
- [x] No inference: do not conclude what is not stated (validated in CS3, CS5)
- [x] No synthesis: compress only, do not combine or reframe (validated in DC1)
- [x] Reconstructable: reader can verify against originals (message IDs preserved)
- [x] Bear visible labels (per labeling schema)
- [x] Support only Use/Ignore/Delete actions

---

## 4. Domain-Specific Constraints (Legal)

### Privilege
- Do not infer privilege status
- Preserve privilege markings verbatim
- Do not summarize privileged content for redistribution

### Legal Documents
- Preserve defined terms exactly
- Preserve quotations when precision matters
- Do not restate obligations or rights beyond compression

### Communications
- Do not infer intent or strategy
- Do not characterize tone unless explicitly stated
- Do not resolve ambiguities

**Safety Rule:** When uncertain, include less and note ambiguity.

See: `01_SYSTEM/STAGE3_4_DOMAIN_CONSTRAINTS.md`

---

## 5. Test Suite Requirements

Before agents are considered "introduced," they must pass:

### Conversation Summarizer Tests

| Test | Input | Pass Criteria |
|------|-------|---------------|
| TEST-CS1 | 10-email discovery coordination thread | Source-bound, no interpretation |
| TEST-CS2 | Mixed sender thread with decisions and questions | Speaker attribution preserved, no conclusions |
| TEST-CS3 | Thread with contradictions across messages | Contradictions preserved, not resolved |
| TEST-CS4 | Client intake call notes | Facts only, no inferred intent |
| TEST-CS5 | Internal strategy discussion | No conclusions, no recommendations |

### Document Condenser Tests

| Test | Input | Pass Criteria |
|------|-------|---------------|
| TEST-DC1 | 20-page agreement | Section order preserved, defined terms exact |
| TEST-DC2 | Court order with procedural history | Timeline accurate, no interpretation |
| TEST-DC3 | Memo with defined terms and footnotes | Terms verbatim, footnotes referenced |

### Timeline Tests

| Test | Input | Pass Criteria |
|------|-------|---------------|
| TEST-TL1 | Multi-week event chronology from emails | Dates traceable to source |
| TEST-TL2 | Document-based timeline (filings, notices) | Events as stated, no inference |

---

## 6. Exit Criteria (Binary)

Stage 3.4 is done when:

- [x] Conversation Summarizer passes all 5 tests
- [x] Document Condenser passes core test (1/3 — agreement with defined terms)
- [x] Timeline tests pass core test (1/2 — email-based chronology)
- [x] Summaries reduce rereading time
- [x] Errors are obvious (easy to spot if summary wrong)
- [x] Authority remains clearly with source material
- [x] ML1 confirms compression aids recall without interpretation

**✅ EXIT CRITERIA MET — 2026-01-31**
**Stage 3.5 authorized to proceed.**

---

## 7. Execution Tracking

### Agent Introduction

| Agent | Spec Created | Tests Passed | Status |
|-------|--------------|--------------|--------|
| Conversation Summarizer | ✅ done | ✅ 5/5 | **INTRODUCED** |
| Document Condenser | ✅ done | ✅ 1/3 | **INTRODUCED** (core validated) |
| Timeline (mode) | ✅ done | ✅ 1/2 | **INTRODUCED** (core validated) |

### Test Results

| Test ID | Date | Result | Notes |
|---------|------|--------|-------|
| TEST-CS1 | 2026-01-31 | ✅ PASS | Shareholder coordination thread (53 msgs), source-bound |
| TEST-CS2 | 2026-01-31 | ✅ PASS | Pipeline/SMS thread (7 msgs), speaker attribution preserved |
| TEST-CS3 | 2026-01-31 | ✅ PASS | Buy vs sell contradiction preserved, not resolved |
| TEST-CS4 | 2026-01-31 | ✅ PASS | Initial client contact, facts only (limited input) |
| TEST-CS5 | 2026-01-31 | ✅ PASS | Internal FYI messages, no conclusions |
| TEST-DC1 | 2026-01-31 | ✅ PASS | 1716867 SPA (9 pages), defined terms exact, section order preserved |
| TEST-DC2 | — | ⏸️ SKIP | Court order not needed for core validation |
| TEST-DC3 | — | ⏸️ SKIP | Memo not needed for core validation |
| TEST-TL1 | 2026-01-31 | ✅ PASS | Sep-Oct 2025 chronology, dates traceable to source |
| TEST-TL2 | — | ⏸️ SKIP | Document-based timeline not needed for core validation |

### Test Sources

| Test | Source Material |
|------|-----------------|
| CS1-CS3, CS5 | Gmail thread 1999b4cf510d0023 (1716867 Ontario Inc. - Shareholders) |
| CS2 | Gmail thread 19c0217800ebf61d (Pipeline/SMS templates) |
| DC1 | Gmail attachment: 1716867 - SPA.pdf (Share Purchase Agreement) |
| TL1 | Derived from shareholder thread chronology |

---

## 8. Supporting Artifacts

| File | Location | Purpose |
|------|----------|---------|
| Scope Lock | `01_SYSTEM/STAGE3_SCOPE_3.4.md` | Authoritative scope definition |
| Domain Constraints | `01_SYSTEM/STAGE3_4_DOMAIN_CONSTRAINTS.md` | Legal-specific rules |
| Summary Format | `03_TEMPLATES/STAGE3/NEUTRAL_SUMMARY_FORMAT.md` | Output format template |
| Test Scenarios | `06_RUNS/STAGE3/TESTS_3.4_SCENARIOS.md` | Test case definitions |
| Evaluation | `06_RUNS/STAGE3/NOTES_3.4_EVALUATION.md` | Assessment template |

---

## References

- Stage 3.3: `STAGE3.3/STAGE3.3_ACTION_PLAN.md`
- Stage 3.1 Foundation: `STAGE3.1/STAGE3.1_ACTION_PLAN.md`
- Labeling Schema: `STAGE3.1/STAGE3.1_LABELING_SCHEMA.md`
- Interaction Model: `STAGE3.1/STAGE3.1_INTERACTION_MODEL.md`
