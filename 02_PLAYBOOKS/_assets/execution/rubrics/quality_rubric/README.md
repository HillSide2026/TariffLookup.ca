---
id: 02_playbooks__execution__quality_rubric_md
title: Quality Rubric
owner: ML1
status: draft
version: 1.0
supersedes:
created_date: 2026-02-11
last_updated: 2026-02-11
tags: [quality, rubric, qa]
---

## Playbook Header
Playbook ID: 02_playbooks__execution__quality_rubric_md
Version: 1.0
Status: draft

Principles Referenced: PRN-001, PRN-002, PRN-003, PRN-004, PRN-005, PRN-006, PRN-007, PRN-008, PRN-009
Policies Applied: POL-002, POL-004, POL-006, POL-007, POL-008, POL-009
Protocols Enforced: PRO-002, PRO-004, PRO-006, PRO-007, PRO-008, PRO-009
Doctrine Invoked: 00_SYSTEM/constitution.md, 01_DOCTRINE/index.yaml

Inputs: TBD
Outputs: TBD
Acceptance Criteria: TBD


# Quality Rubric

## Purpose
Define a measurable, repeatable quality standard for system outputs and provide a clear QA gate.

## Scope
Applies to all agent outputs, with stage‑specific constraints (Stage 3 non‑authoritative; Stage 4 controlled release protocol).

---

## Rubric Dimensions (Score 0–2)

**Scoring:**
- **2 = Pass** (meets expectation)
- **1 = Partial** (minor gaps; still usable with edits)
- **0 = Fail** (material defect)

### 1) Clarity
- **2:** Clear structure, unambiguous language, easy to scan.
- **1:** Mostly clear but contains vague/awkward phrasing or confusing ordering.
- **0:** Unclear or difficult to interpret.

### 2) Completeness
- **2:** Addresses all required sections and expected coverage for the request.
- **1:** Minor omissions; still broadly useful.
- **0:** Missing critical sections or key coverage.

### 3) Correctness
- **2:** No factual or logical errors relative to provided inputs.
- **1:** Minor inaccuracies that do not materially change outcome.
- **0:** Material errors or misleading content.

### 4) Usefulness
- **2:** Directly usable for the intended purpose with minimal edits.
- **1:** Some value but requires notable rework.
- **0:** Not usable for the intended purpose.

### 5) No Hallucinations
- **2:** All factual claims trace to inputs or explicitly marked assumptions.
- **1:** Minor unverifiable claims; easily removable.
- **0:** Unsubstantiated claims that affect decisions or trust.

### 6) Proper Scope & Authority
- **2:** Respects stage constraints and authority limits.
- **1:** Minor scope drift but no prohibited action.
- **0:** Violates scope (e.g., advice in Stage 3, unapproved external action).

---

## Automatic Fail Conditions (Any = Fail)
- Output violates stage constraints (e.g., Stage 3 giving advice or executing actions).
- Unapproved external writes or write‑back instructions.
- Missing required output format (if specified).
- Hallucinated facts that materially affect decisions.

---

## QA Gate (Pass/Fail)

To pass:
- **No automatic fail conditions**
- **Correctness = 2**
- **No Hallucinations = 2**
- **Proper Scope & Authority = 2**
- **Total score ≥ 11/12** (all dimensions combined)

---

## Output/Deliverable Complexity Ladder (D1–D4)

Use these tiers to ratchet quality expectations over time as outputs become more complex.

**D1 — Simple Output**
- Single artifact, single domain, no cross‑references
- Expect **Total score ≥ 11/12**

**D2 — Structured Output**
- Multiple sections, cross‑references, or schema adherence
- Expect **Total score ≥ 11/12**

**D3 — Multi‑Artifact Output**
- References multiple sources or artifacts; traceability required
- Expect **Total score ≥ 11/12**

**D4 — Controlled Propagation Context**
- Outputs that could trigger Stage 4 release protocol
- Expect **Total score = 12/12**

---

## Evidence Requirements
Each QA review must cite:
- File paths and line numbers
- Inputs used
- Any assumptions made

---

## Notes
- This rubric defines minimum quality; it does not replace domain judgment.
- If a score fails, the output must be revised and re‑reviewed before use.
