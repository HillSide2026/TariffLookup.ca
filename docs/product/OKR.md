# OKR

Project ID: MHS-2D-MICRO-SAAS-001
Project Path: 04_INITIATIVES/HillSide_PORTFOLIO/MATTHEW_HOLDINGS_17513721_CANADA_INC/2D_MICRO_SAAS_BUILD_AND_SALE
Stage: Planning

## Decision Use
Use this file weekly to decide if execution is on track for launch, output reliability, and budget control.

## Current Execution Note (2026-03-22)

The KPI package below preserves the planning-stage six-jurisdiction threshold set approved on 2026-03-20.

For current implementation completion tracking, do not treat `jurisdiction_coverage_count >= 6` as the live stage target. Use `EU_MVP_COMPLETION_TARGET.md` and `docs/data-sources/EU_COVERAGE_TARGET_STATE.md` for the active EU-only HS-6-floor completion model.

## Approved Budget Envelope
- Currency: `CAD`
- `planned_spend`: `500`
- Budget variance control uses this planned spend unless ML1 approves a formal change.

## Objectives and Key Results

### Objective 1: Launch the scoped TariffLookup.ca MVP on schedule
- KR1: `mvp_launch_on_or_before_target = 1`
- KR2: `jurisdiction_coverage_count >= 6`
- KR3: `tariff_lookup_success_rate >= 95%`

### Objective 2: Deliver reliable tariff and agreement outputs
- KR1: `sampled_lookup_accuracy_rate >= 95%`
- KR2: `preferential_rule_completeness_rate >= 95%`
- KR3: `p95_lookup_response_seconds <= 3`

### Objective 3: Maintain controlled adoption and spend
- KR1: `pilot_activated_organizations >= 5`
- KR2: `launch_exception_backlog <= 3`
- KR3: `project_budget_variance_pct <= 10%`

## KPI Definitions

| KPI | Definition | Formula | Decision Use |
| --- | --- | --- | --- |
| `mvp_launch_on_or_before_target` | Whether MVP goes live by approved launch date | `1 if mvp_launch_date <= target_launch_date else 0` | Launch discipline |
| `jurisdiction_coverage_count` | Count of jurisdictions fully configured for lookup | `count(jurisdictions with MFN + preferential + agreement mapping + QA pass)` | Scope completeness |
| `tariff_lookup_success_rate` | Share of lookup requests returning valid structured results | `(successful_lookup_responses / total_lookup_requests) * 100` | Product operability |
| `sampled_lookup_accuracy_rate` | Share of sampled lookup outputs verified against source schedules | `(verified_correct_sampled_results / total_sampled_results_verified) * 100` | Output reliability |
| `preferential_rule_completeness_rate` | Share of sampled eligible cases with valid preferential-logic output | `(eligible_cases_with_valid_preferential_output / total_sampled_eligible_cases) * 100` | Agreement-logic quality |
| `p95_lookup_response_seconds` | 95th percentile response time for completed lookups | `p95(lookup_response_seconds)` | User experience control |
| `pilot_activated_organizations` | Count of unique pilot organizations actively using lookup flow | `count(unique organizations with at least one completed lookup)` | Early adoption |
| `launch_exception_backlog` | Count of unresolved launch-blocking issues | `open_launch_blockers` | Launch stability control |
| `project_budget_variance_pct` | Variance from approved budget envelope | `((actual_spend - planned_spend) / planned_spend) * 100` | Budget control |

## Measurement Method
- Use application logs, analytics events, and issue-tracking logs as primary sources.
- Require timestamped evidence for launch, lookup, and validation events.
- Verify sampled tariff outputs against source schedules and agreement references.
- Measure budget variance using approved spend envelope and booked spend only.

## Measurement Rules
- `mvp_launch_on_or_before_target` is valid only when both target date and actual launch date are recorded.
- `planned_spend` is fixed at `CAD 500` unless changed by explicit ML1 approval.
- `jurisdiction_coverage_count` includes only jurisdictions with complete data mapping and QA pass.
- `tariff_lookup_success_rate` excludes requests rejected for invalid HS-code format at input validation.
- `sampled_lookup_accuracy_rate` sampling set must include all six jurisdictions each review cycle.
- `preferential_rule_completeness_rate` includes only cases where a preferential pathway may apply.
- `p95_lookup_response_seconds` is measured on successful lookup requests only.
- `pilot_activated_organizations` counts each organization once per reporting period.
- `launch_exception_backlog` includes only unresolved severity-1 or severity-2 launch blockers.
- `project_budget_variance_pct` excludes speculative or unbooked expenses.

## Reporting Cadence
- Weekly trailing 7 days for operating review.
- Monthly rollup for trend and decision support.

## Baseline Capture
No pre-launch baseline capture period is defined. Baseline values are established from the first 30 days after MVP launch.

## Threshold Governance
Thresholds are proposed in `ML1_METRIC_APPROVAL.md` and become active only after explicit ML1 approval.
