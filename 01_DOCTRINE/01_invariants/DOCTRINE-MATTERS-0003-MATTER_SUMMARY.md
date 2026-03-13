---
id: DOCTRINE-MATTERS-0003
title: Matter Summary Doctrine
owner: ML1
status: draft
version: 1.0
created_date: 2026-02-24
last_updated: 2026-02-24
tags: [doctrine, matters]

effective_date:
supersedes:

provenance:
  decided_by: ML1
  decided_on:
  context:
---

# Matter Summary Doctrine

**Document ID:** DOCTRINE-MATTERS-0003  
**Status:** DRAFT  
**Effective:** TBD  
**Authority:** ML1

---

## 1. Purpose

The Matter Summary is the canonical, compressed representation of a matter's current economic, control, risk, and strategic state.

It exists to answer, in under 60 seconds:
- What is this matter?
- Why does it matter economically?
- What is its current control state?
- What is the next material decision?
- Where is the risk?
- What tension does it create for the firm?

The Matter Summary is not a narrative memo. It is a structured state snapshot.

## 2. Role in ML2

The Matter Summary:
- aggregates data from Matter, Solution, and Risk layers
- is the primary object consumed by dashboards
- is the primary briefing artifact for ML1
- is regenerated from canonical fields (not manually composed free-text)
- must be reproducible from structured state

It is the matter-level cognitive interface.

## 3. Design Principles

Deterministic Where Possible
- Revenue, state, aging, and ratios must be derived.

Opinionated but Bounded
- Limited short-form human judgment allowed (e.g., strategic significance).

No Redundant Narrative
- It references structured fields; it does not duplicate them.

Time-Stamped
- Every summary must have a generated_at timestamp.

Override Transparency
- If any matter state or risk is manually overridden, that must appear in the summary.

## 4. Required Sections (Canonical Order)

### A. Identity Block
- matter_id
- matter_name
- client_name
- owner
- engagement_date
- matter_state

### B. Economic Snapshot
- est_total_value
- est_remaining_revenue
- amount_billed_to_date
- amount_collected_to_date
- ar_balance
- ar_age_bucket
- probability_weighted_pipeline_value (if pipeline present)

Purpose: show economic exposure and cash status.

### C. Solution Snapshot
- total_solutions
- active_solutions_count
- pipeline_solutions_count
- highest_value_solution_id
- next_solution_milestone

Purpose: show monetization structure.

### D. Control Snapshot
- matter_state
- days_in_current_state
- next_decision_required
- decision_age_days
- blocking_actor (if any)
- inactivity_days

Purpose: show flow friction.

### E. Risk Snapshot

Economic Risk:
- economic_risk_score_0_100
- economic_primary_driver (largest ratio driver)

Execution Risk:
- execution_risk_score_0_100
- execution_driver_solution_id

Relationship Risk:
- relationship_risk_flags (array)

Purpose: show instability concentration.

### F. Capacity Impact
- production_owner_load_ratio
- review_dependency (boolean)
- estimated_hours_remaining
- solutions_per_owner

Purpose: show human system load.

### G. Strategic Alignment
- client_strategic_tier
- matter_strategic_weight
- margin_band (if available)
- strategic_drift_flags

Purpose: show direction fit.

### H. Tension Summary (Short Text, Max 500 chars)

One structured sentence:

Format:
"This matter is [economic significance] and currently [control state]. Primary tension: [risk/control/capacity driver]. Next leverage point: [decision/action]."

This is the only narrative field allowed.

## 5. Regeneration Rules

The Matter Summary must be recomputed on:
- matter_state change
- solution_stage change
- billing update
- A/R aging update
- risk threshold breach
- daily snapshot run

Stored as:
- 05_MATTERS/<matter_id>/matter_summary.json, or
- central derived snapshot in state/

Compatibility note:
- Current scaffolds also produce matter_summary.md in run outputs (see new_matter_scaffold).

Snapshotted in 06_RUNS during periodic firm-state runs.

## 6. Governance Rules

- No free-text editing of derived fields.
- Manual overrides must appear in override_reason and override_timestamp.
- Matter Summary is authoritative for dashboard display.
- If structured fields conflict with summary content, structured fields win.
