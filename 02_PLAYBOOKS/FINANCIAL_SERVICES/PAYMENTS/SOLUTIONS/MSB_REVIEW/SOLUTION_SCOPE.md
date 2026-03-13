---
id: 02_playbooks__financial_services__payments__solutions__msb_review__solution_scope_md
title: Solution Scope: MSB_REVIEW
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Solution Scope: MSB_REVIEW

## In Scope

The MSB Review solution includes legal analysis and assessment of:

- **MSB activity characterization** — Review of current business activities against MSB categories
- **Registration status** — Review of existing FINTRAC MSB registration information for completeness and consistency
- **Change analysis** — Identification of business, product, or operational changes since last registration or review
- **Compliance framework alignment** — High-level review of AML/KYC components for structural alignment with MSB obligations
- **Risk exposure identification** — Identification of apparent regulatory risk areas or compliance gaps
- **Issue prioritization** — Categorization of findings by relative materiality and urgency

## Permitted Potential Workstreams

### A. STR / LVTR Advisory

Advisory guidance relating to Suspicious Transaction Reports (STRs) and Large Virtual Currency Transaction Reports (LVTRs).

- Interpretive advice
- Issue identification
- Escalation signaling

Excludes: filing or submission, operational execution, transaction testing.

### B. Quarterly Internal Effectiveness Review

Periodic, internal-only review conducted on a quarterly cadence.

- Design and structural effectiveness
- Internal consistency and completeness
- Advisory and comparative across periods

Not a regulatory examination or audit.

### C. Internal Annual Health Check

Periodic, holistic internal assessment conducted annually. Distinct from quarterly reviews.

- Accumulated risk signals
- Structural drift
- Overall compliance posture

Explicitly non-regulatory and non-examination in nature.

## Architectural Constraints

- Internal-facing only
- No regulator submissions
- No assumption of compliance officer or reporting entity role
- Escalation to FINTRAC_RESPONSE requires explicit human decision

## Out of Scope

Unless separately agreed, this solution does not include:

- Drafting or updating AML/KYC policies or procedures
- Filing amendments or notices with FINTRAC
- Responding to FINTRAC examinations, requests, or enforcement actions
- Acting as compliance officer or ongoing advisor
- Transaction testing or data-level reviews
- Legal opinions or certifications

## Terminal States

| State | Description |
|-------|-------------|
| Exit | Review complete; findings delivered; no further action required |
| Referral | Findings require MSB_INTAKE_AND_REGISTRATION (amendment), FINTRAC_RESPONSE, or AML/KYC program work |
| Self-serve | Client proceeds with internal remediation based on findings |

## Escalation Hooks

- Findings implicating active or imminent regulator engagement
- Unregistered MSB activity identified
- Material mischaracterization of registered activities
