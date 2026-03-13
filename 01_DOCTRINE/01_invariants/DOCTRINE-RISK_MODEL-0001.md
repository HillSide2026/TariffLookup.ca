---
id: DOCTRINE-RISK_MODEL-0001
title: Risk Model Doctrine (Economic, Execution, Relationship)
owner: ML1
status: draft
version: 1.0
created_date: 2026-02-24
last_updated: 2026-02-24
tags: [doctrine, risk]

effective_date:
supersedes:

provenance:
  decided_by: ML1
  decided_on:
  context:
---

# Risk Model Doctrine (Economic, Execution, Relationship)

**Document ID:** DOCTRINE-RISK_MODEL-0001  
**Status:** DRAFT  
**Effective:** TBD  
**Authority:** ML1

---

## 1. Purpose

Define a firm-wide risk model that:
- is computable from deterministic fields where possible
- separates economic instability from execution complexity and relationship degradation
- supports portfolio-level monitoring and matter-level prioritization
- avoids a single subjective risk number

## 2. Risk Axes

Risk is decomposed into three axes.

### A. Economic Risk (Derived)

Economic risk is computed from portfolio ratios. It is not manually scored.

Components (portfolio-level):
- Top-3 Client Concentration Ratio
- A/R Over-Threshold Ratio
- Decision-Constrained Revenue Ratio
- Low-Probability Pipeline Ratio
- Single-Matter Dependency Ratio

Economic Risk Score rules:
- weighted function of the above ratios
- weighting is explicit and stored as configuration
- ratios are normalized to 0-1
- score is stored as 0-100

Economic Risk is evaluated at:
- firm level (primary)
- optionally client level (same ratios within client portfolio)

### B. Execution Risk (Bounded, Partly Judgment-Based)

Execution risk is derived from solution-level fields that are bounded and auditable.

Required solution fields:
- complexity_level (1-5)
- regulatory_exposure (low|med|high)
- external_dependency_count (integer >= 0)
- novelty_flag (boolean)

Execution Risk at Matter Level:
- matter execution risk equals the maximum execution risk score across active solutions within the matter
- active solution definition: solution_stage in {approved, in_production, client_review, awaiting_external}

### C. Relationship Risk (Signals-First)

Relationship risk is not initially collapsed into a single score. The system logs signals and can later score them.

Signals (per matter or per client):
- days_since_client_response
- open_invoice_days_outstanding
- discount_frequency_90d
- scope_disputes_90d
- expansion_rejections_180d

Relationship risk is flagged when any signal breaches its threshold.

## 3. Thresholds and Configuration

All thresholds are explicit, versioned, and adjustable:
- AR_THRESHOLD_DAYS (e.g., 60)
- LOW_PROB_THRESHOLD (e.g., 0.4)
- DECISION_AGING_DAYS (e.g., 7/14)
- CLIENT_RESPONSE_DAYS (e.g., 7)
- DISCOUNT_FREQ_LIMIT_90D (integer)
- SCOPE_DISPUTES_LIMIT_90D (integer)
- EXPANSION_REJECTION_LIMIT_180D (integer)

## 4. Governance Rules

- Economic Risk must be reproducible from stored data. No manual overrides.
- Execution Risk inputs may be human-entered but must be bounded and attributable to an owner and timestamp.
- Relationship Risk begins as signals and threshold flags; scoring is deferred until signals have sufficient history.
- All risk metrics must retain traceability: which matters and solutions contributed, and which thresholds and weights were used.

## 5. Outputs (Canonical)

The system produces:
- Firm Economic Risk Score (0-100)
- Firm Economic Risk Component Ratios (0-1)
- Matter Execution Risk Score (0-100) plus contributing solution_id
- Relationship Risk Flags (per signal, per matter or client)
