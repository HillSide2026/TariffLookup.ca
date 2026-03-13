---
id: 02_playbooks__financial_services__payments__solutions__fintrac_response__readme_md
title: FINTRAC Response — Overview
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# FINTRAC Response — Overview

Structured legal workstream for responding to FINTRAC inquiries, examinations, compliance assessments, and enforcement-related correspondence.

This solution is bounded and regulator-facing, invoked only in connection with active or imminent FINTRAC engagement.

## Typical Use Cases

- FINTRAC compliance examination
- Voluntary self-disclosure
- Information request or production demand
- Post-examination follow-up or remediation direction

## Permitted Potential Workstream

Inclusion of a workstream does not imply automatic execution; all workstreams are optional and engagement-specific.

| Workstream | Description |
|------------|-------------|
| Two-Year Effectiveness Review Report | Preparation support for a regulator-structured effectiveness review report |

## What This Solution Is Not

- Not ongoing compliance management
- Not AML/KYC program design or implementation
- Not MSB registration or amendment
- Not proactive compliance review (see MSB_REVIEW)

## Interfaces

- Invoked by: FINTRAC contact, escalation from MSB_INTAKE_AND_REGISTRATION or MSB_REVIEW
- Produces: Response deliverables, document production, correspondence
- Consumes: Existing registration data, compliance documentation, FINTRAC correspondence
- Overlays available: AML_KYC_PROGRAM, RAILS, CRYPTO

## Operating Posture

Containment over completeness; explicit exit states; no assumed ongoing representation.
