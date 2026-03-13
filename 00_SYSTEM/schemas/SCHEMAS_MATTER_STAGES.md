---
id: 00_system__schemas_matter_stages_md
title: Matter Stages — Schema
owner: ML1
status: draft
created_date: 2026-02-24
last_updated: 2026-02-24
tags: [schema, matters]
---

# Matter Stages — Schema

**Status:** Draft

---

## Data Model — Matter Object

```json
{
  "matter_id": "string",
  "matter_name": "string",
  "client_id": "string",
  "engagement_date": "date",
  "matter_state": "enum",
  "state_effective_date": "date",
  "est_total_value": "number",
  "est_remaining_revenue": "number",
  "risk_level_1_5": "integer",
  "next_decision_required": "string | null",
  "blocking_actor": "string | null",
  "last_activity_date": "date",
  "inactivity_threshold_days": "integer",
  "ar_balance": "number",
  "state_reason": "string",
  "manual_override": "boolean",
  "last_updated": "timestamp"
}
```

## matter_state Enum Values
- prospective
- engaged_active
- engaged_decision_constrained
- engaged_externally_blocked
- revenue_realization
- ongoing_advisory
- at_risk
- dormant
- pending_close
- closed

## Required Field Rules
- If state = engaged_decision_constrained -> next_decision_required required.
- If state = engaged_externally_blocked -> blocking_actor required.
- If days_since(last_activity_date) > inactivity_threshold -> auto-flag for Dormant.
- If ar_balance > AR_threshold -> auto-flag for At-Risk candidate.
- If est_remaining_revenue = 0 and all solutions delivered -> Revenue Realization or Pending Close.
- State must be explainable by data, not intuition.
