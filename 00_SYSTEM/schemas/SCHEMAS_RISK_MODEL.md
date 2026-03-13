---
id: 00_system__schemas_risk_model_md
title: Risk Model - Schema
owner: ML1
status: draft
created_date: 2026-02-24
last_updated: 2026-02-24
tags: [schema, risk]
---

# Risk Model - Schema

**Status:** Draft

---

## 1. Applies To

- Firm-level derived metrics
- Matter-level fields and derived metrics
- Solution-level required fields for execution risk
- Client-level relationship signals (optional)

### Stage Subset References (Authoritative)

- Pre-work stages are defined in SCHEMAS_SOLUTIONS.md under PRE_WORK_STAGES.
- Active work stages are defined in SCHEMAS_SOLUTIONS.md under ACTIVE_WORK_STAGES.
- Completed stages are defined in SCHEMAS_SOLUTIONS.md under COMPLETED_STAGES.

No other stage sets may be used for risk computations.

## 2. Enums

regulatory_exposure:
- low
- med
- high

relationship_risk_flags:
- client_unresponsive
- invoice_aging
- discounting
- scope_disputes
- expansion_resistance

## 3. Solution Fields (Required for Execution Risk)

Add to Solution object:
- complexity_level: integer (1-5)
- regulatory_exposure: enum (low|med|high)
- external_dependency_count: integer (>= 0)
- novelty_flag: boolean

Validation:
- complexity_level must be 1..5
- external_dependency_count must be integer >= 0

## 4. Matter Fields (Required for Relationship Signals and Derived Execution Risk)

Add to Matter object (signals may be null until instrumented):
- days_since_client_response: integer (>= 0) | null
- open_invoice_days_outstanding: integer (>= 0) | null
- discount_frequency_90d: integer (>= 0) | null
- scope_disputes_90d: integer (>= 0) | null
- expansion_rejections_180d: integer (>= 0) | null

Derived (system-computed):
- execution_risk_score_0_100: number (0-100)
- execution_risk_driver_solution_id: string | null
- relationship_risk_flags: array of strings (relationship_risk_flags enum)

## 5. Firm-Level Metrics (Derived)

Stored in a firm metrics object or snapshot:

```yaml
economic_risk_score_0_100: number (0-100)
economic_risk_components:
  top3_client_concentration_ratio: number (0-1)
  ar_over_threshold_ratio: number (0-1)
  decision_constrained_revenue_ratio: number (0-1)
  low_probability_pipeline_ratio: number (0-1)
  single_matter_dependency_ratio: number (0-1)
economic_risk_config:
  ar_threshold_days: integer
  low_prob_threshold: number (0-1)
  weights:
    top3_client_concentration: number (0-1)
    ar_over_threshold: number (0-1)
    decision_constrained_revenue: number (0-1)
    low_probability_pipeline: number (0-1)
    single_matter_dependency: number (0-1)
```

Validation:
- weights must sum to 1.0 (+/-0.001)
- all ratios must be within 0..1
- thresholds must be non-negative

## 6. Computation Rules (Deterministic)

Top 3 Client Concentration Ratio:
```
(sum est_remaining_revenue of top 3 clients) / (sum est_remaining_revenue of all clients)
```

A/R Over-Threshold Ratio:
```
(sum ar_balance where ar_age_days > ar_threshold_days) / (sum ar_balance)
```

Decision-Constrained Revenue Ratio:
```
(sum est_remaining_revenue where matter_state = engaged_decision_constrained) / (sum est_remaining_revenue)
```

Low-Probability Pipeline Ratio:
Pipeline value definition:
```
sum (solution.est_value * solution.probability_of_close)
for solution_stage in PRE_WORK_STAGES
```

Low-prob subset:
```
solutions where probability_of_close < low_prob_threshold
```

Ratio:
```
(low-prob pipeline weighted value) / (total pipeline weighted value)
```

Single-Matter Dependency Ratio:
```
(max est_remaining_revenue across matters) / (sum est_remaining_revenue)
```

Economic Risk Score:
```
100 * sum(weight_i * component_ratio_i)
```

Execution Risk Score (per-solution):
```
base = 20 * complexity_level
regulatory modifier: low +0, med +10, high +20
dependency modifier: min(20, 2 * external_dependency_count)
novelty modifier: +10 if novelty_flag = true
score = clamp(base + modifiers, 0, 100)
```

Matter execution risk: max across solutions where solution_stage in ACTIVE_WORK_STAGES; store driver solution_id.

Relationship Risk Flags:
Flag if:
- days_since_client_response > CLIENT_RESPONSE_DAYS
- open_invoice_days_outstanding > AR_THRESHOLD_DAYS (or separate INVOICE_THRESHOLD_DAYS)
- discount_frequency_90d > DISCOUNT_FREQ_LIMIT_90D
- scope_disputes_90d > SCOPE_DISPUTES_LIMIT_90D
- expansion_rejections_180d > EXPANSION_REJECTION_LIMIT_180D

## 7. Required Integration Points

To compute Economic Risk components, system must have:
- est_remaining_revenue per matter
- client association per matter
- ar_balance and ar_age_days (or invoice aging buckets)
- matter_state values
- solution pipeline stages plus probability_of_close and est_value
