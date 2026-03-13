---
id: DOCTRINE-2026-008
title: Run Outcome Rules (Promote / Park / Archive)
owner: ML1
status: approved
version: 1.0
effective_date: 2026-02-19
created_date: 2026-02-19
last_updated: 2026-02-19
tags: [runs, outcomes, procedural, governance]

supersedes:
provenance:
  decided_by: ML1
  decided_on: 2026-02-19
  context: Approved doctrine defining required run outcomes and recording rules
---

# Run Outcome Rules (Promote / Park / Archive)

**Document ID:** DOCTRINE-2026-008
**Status:** APPROVED
**Effective:** 2026-02-19
**Authority:** ML1

---

## Purpose

Ensure every run concludes with a single, explicit outcome so the system compounds and does not drift.

---

## Scope

Applies to all runs recorded under `06_RUNS/`.

---

## Rule: Exactly One Outcome

Every run MUST end in exactly one outcome:

1. **Promote**
2. **Park**
3. **Archive**

A run is incomplete until the outcome is recorded.

---

## Outcome Recording (Required)

Each run MUST include an `OUTCOME.yaml` that records:
- `run_id`
- `date`
- `outcome` (PROMOTE | PARK | ARCHIVE)
- `promoted_to` (optional)
- `parked_items` (optional)
- `archive_reason` (if ARCHIVE)
- `notes`

Reference template:
- `06_RUNS/_RUN_TEMPLATE/OUTCOME.yaml`

---

## Outcome Requirements

### Promote
- Canon artifact created or updated
- Version metadata and supersession recorded where applicable
- Index updated at the relevant layer

### Park
- Create a distillation stub in `06_RUNS/99_distill_queue/`
- Stub must include: what to distill, candidate target, blocking questions (if any), canon refs

### Archive
- Record an explicit archive reason
- No promotion or distillation required

---

## Prohibited

- Leaving a run without an outcome
- Recording multiple outcomes for the same run
- Retroactive changes to outcomes without an explicit note in `OUTCOME.yaml`

---

## Relationship to Other Doctrine

- Promotion rules are defined in `01_DOCTRINE/04_procedural/DOCTRINE-2026-003-promotion-rules.md`.
- Discoverability and versioning requirements apply when promotion occurs (POL-011, POL-010).

---

## Enforcement

Runs missing outcomes are non-compliant and must be corrected before any promotion proceeds.
