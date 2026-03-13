---
id: 10_archive__initiatives__system_portfolio__stage3__stage3_2__stage3_2_action_plan_md
title: Stage 3.2 — Outlines & Structural Skeletons
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Stage 3.2 — Outlines & Structural Skeletons

## Status

- **Status:** ✅ COMPLETE
- **Owner:** ML1
- **Effective Start:** 2026-01-30 (Stage 3.1 complete)
- **Closed:** 2026-01-30
- **Authority Gate:** Exit criteria met — Stage 3.3 authorized

---

## Stage 3.2 Core Question

> Can the system reliably generate useful structure that helps ML1 start faster, without drafting content?

**Stage 3.2 succeeds if structure is unambiguously distinguishable from drafting.**
Its job is to provide cognitive scaffolding, not sentences.

---

## 1. Scope Definition

### In-Scope (Structure Only)

| Element | Example |
|---------|---------|
| Headers | `## Background`, `## Request` |
| Structural ordering | "Context before ask" |
| Placeholders | `[INSERT: your position on X]` |
| Structural markers | bullet hierarchies, section breaks |

### Out-of-Scope (Content / Drafting)

| Element | Why Excluded |
|---------|--------------|
| Full paragraphs | Drafting, not structure |
| Polished sentences | Language, not skeleton |
| Suggested phrasing | Tempts verbatim use |
| Anything send-ready | Violates 3.1 contracts |

---

## 2. Agents Introduced

### Agent 1: Email Structurer

**Function:** Generate outline for professional emails
**Output:** Structural skeleton with placeholders
**Ceiling:** No complete sentences

See: `STAGE3.2_EMAIL_STRUCTURER_SPEC.md`

### Agent 2: Document Structurer

**Function:** Generate outline for legal/professional documents
**Output:** Section headers with structural guidance
**Ceiling:** No paragraph prose

See: `STAGE3.2_DOCUMENT_STRUCTURER_SPEC.md`

---

## 3. Constraints (Inherited from 3.1)

All Stage 3.2 outputs must:

- [x] Bear visible labels (per labeling schema)
- [x] Support only Use/Ignore/Delete actions
- [x] Never enter Stage 2 queues
- [x] Remain ephemeral by default

---

## 4. Test Suite Requirements

Before agents are considered "introduced," they must pass:

### Email Structurer Tests

| Test | Input | Pass Criteria |
|------|-------|---------------|
| TEST-E1 | "Email to opposing counsel about discovery deadline" | Structure only, no sentences |
| TEST-E2 | "Follow-up email to client after consultation" | Placeholders present, no drafted content |
| TEST-E3 | "Email declining a meeting request professionally" | Labels visible, no ready-to-send text |

### Document Structurer Tests

| Test | Input | Pass Criteria |
|------|-------|---------------|
| TEST-D1 | "Memo to file on settlement discussion" | Section headers only, no prose |
| TEST-D2 | "Client intake summary structure" | Structural guidance, no filled content |
| TEST-D3 | "Case status update outline" | Hierarchy clear, no sentences |

---

## 5. Exit Criteria (Binary)

Stage 3.2 is done when:

- [x] Email Structurer passes all 3 tests
- [x] Document Structurer passes all 3 tests
- [x] Both agents produce structure-only output reliably
- [x] No output contains complete sentences or prose
- [x] ML1 confirms scaffolding aids thinking without drafting

**✅ EXIT CRITERIA MET — 2026-01-30**
**Stage 3.3 authorized to proceed.**

---

## 6. Execution Tracking

### Agent Introduction

| Agent | Spec Created | Tests Passed | Status |
|-------|--------------|--------------|--------|
| Email Structurer | ✅ done | ✅ 3/3 | **INTRODUCED** |
| Document Structurer | ✅ done | ✅ 3/3 | **INTRODUCED** |

### Test Results

| Test ID | Date | Result | Notes |
|---------|------|--------|-------|
| TEST-E1 | 2026-01-30 | ✅ PASS | Structure only, no sentences |
| TEST-E2 | 2026-01-30 | ✅ PASS | Placeholders present, no drafted content |
| TEST-E3 | 2026-01-30 | ✅ PASS | Labels visible, no ready-to-send text |
| TEST-D1 | 2026-01-30 | ✅ PASS | Section headers only, no prose |
| TEST-D2 | 2026-01-30 | ✅ PASS | Structural guidance, no filled content |
| TEST-D3 | 2026-01-30 | ✅ PASS | Hierarchy clear, no sentences |

See: `TEST_RESULTS.md` for detailed outputs

---

## References

- Stage 3.1 Foundation: `STAGE3.1/STAGE3.1_ACTION_PLAN.md`
- Labeling Schema: `STAGE3.1/STAGE3.1_LABELING_SCHEMA.md`
- Interaction Model: `STAGE3.1/STAGE3.1_INTERACTION_MODEL.md`
