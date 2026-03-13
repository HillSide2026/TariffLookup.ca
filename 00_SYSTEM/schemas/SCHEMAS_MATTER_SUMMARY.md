---
id: 00_system__schemas_matter_summary_md
title: Matter Summary - Schema
owner: ML1
status: draft
created_date: 2026-02-24
last_updated: 2026-02-24
tags: [schema, matters]
---

# Matter Summary - Schema

**Status:** Draft

---

## Applies To

Derived matter-level summary object.

## Object: matter_summary

```json
{
  "matter_id": "string",
  "generated_at": "timestamp",

  "identity": {
    "matter_name": "string",
    "client_name": "string",
    "owner": "string",
    "engagement_date": "date",
    "matter_state": "enum"
  },

  "economic": {
    "est_total_value": "number",
    "est_remaining_revenue": "number",
    "amount_billed_to_date": "number",
    "amount_collected_to_date": "number",
    "ar_balance": "number",
    "ar_age_bucket": "enum",
    "probability_weighted_pipeline_value": "number"
  },

  "solutions": {
    "total_solutions": "integer",
    "active_solutions_count": "integer",
    "pipeline_solutions_count": "integer",
    "highest_value_solution_id": "string | null",
    "next_solution_milestone": "string | null"
  },

  "control": {
    "matter_state": "enum",
    "days_in_current_state": "integer",
    "next_decision_required": "string | null",
    "decision_age_days": "integer | null",
    "blocking_actor": "string | null",
    "inactivity_days": "integer"
  },

  "risk": {
    "economic_risk_score_0_100": "number",
    "economic_primary_driver": "string",
    "execution_risk_score_0_100": "number",
    "execution_driver_solution_id": "string | null",
    "relationship_risk_flags": "array<string>"
  },

  "capacity": {
    "production_owner_load_ratio": "number",
    "review_dependency": "boolean",
    "estimated_hours_remaining": "number",
    "solutions_per_owner": "object"
  },

  "strategy": {
    "client_strategic_tier": "enum",
    "matter_strategic_weight": "number",
    "margin_band": "enum | null",
    "strategic_drift_flags": "array<string>"
  },

  "tension_summary": "string"
}
```

## Enums

ar_age_bucket:
- current
- 30
- 60
- 90_plus

client_strategic_tier:
- core
- growth
- opportunistic
- legacy

margin_band (optional):
- high
- acceptable
- thin
- negative

matter_state:
- See `00_SYSTEM/schemas/SCHEMAS_MATTER_STAGES.md`

relationship_risk_flags:
- client_unresponsive
- invoice_aging
- discounting
- scope_disputes
- expansion_resistance

## Pipeline Computation (Authoritative)

### pipeline_solutions_count (Authoritative Definition)

pipeline_solutions_count =
count of solutions where solution_stage in PRE_WORK_STAGES
(as defined in SCHEMAS_SOLUTIONS.md).

### probability_weighted_pipeline_value (Authoritative Definition)

probability_weighted_pipeline_value =
sum (est_value * probability_of_close)
for solutions where solution_stage in PRE_WORK_STAGES.

Missing-value rules:
- If est_value is missing or null -> treat as 0
- If probability_of_close is missing or null -> treat as 0

Rounding rule:
- Do not round per-solution; round once at the final aggregate value.

## Validation Rules

- generated_at required.
- All derived numeric fields must be >= 0.
- economic_risk_score_0_100 must be 0-100.
- execution_risk_score_0_100 must be 0-100.
- tension_summary <= 500 characters.
- If matter_state = engaged_decision_constrained: next_decision_required must not be null.
- If ar_balance > 0: ar_age_bucket must not be null.
- If execution_risk_score_0_100 > 0: execution_driver_solution_id must reference valid solution_id.

## Derived Field Integrity

- est_remaining_revenue = sum(solution remaining revenue)
- economic risk components must match firm-level computation logic
- days_in_current_state = today - state_effective_date
- inactivity_days = today - last_activity_date
- No field in Matter Summary may contradict canonical Matter or Solution objects.
