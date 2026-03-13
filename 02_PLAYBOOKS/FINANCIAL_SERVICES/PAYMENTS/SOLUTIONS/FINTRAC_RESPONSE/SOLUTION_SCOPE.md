---
id: 02_playbooks__financial_services__payments__solutions__fintrac_response__solution_scope_md
title: Solution Scope: FINTRAC_RESPONSE
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Solution Scope: FINTRAC_RESPONSE

## In Scope

- Reviewing and analyzing FINTRAC correspondence
- Organizing and preparing document production
- Drafting response correspondence
- Advising on examination scope and process
- Identifying compliance gaps exposed by FINTRAC inquiry
- Coordinating with client on response strategy

## Permitted Potential Workstream

### Two-Year Effectiveness Review Report

Preparation support for a Two-Year Effectiveness Review Report.

- Structured for regulator consumption
- Prepared as an advisory deliverable
- Based on prior internal materials, documented assumptions, and clearly scoped review periods
- No silent reuse of internal-only artifacts without relabeling and context

## Architectural Constraints

- No ongoing compliance management
- No silent reuse of internal-only artifacts without relabeling and context
- All regulator-facing outputs must be explicitly scoped and versioned

## Out of Scope

Unless expressly agreed in writing, this solution does not include:

- Redesigning or implementing AML/KYC programs
- Filing MSB registration amendments
- Ongoing compliance monitoring
- Acting as compliance officer or designated responsible person
- Litigation or administrative tribunal proceedings
- Transaction-level data analysis or testing

## Terminal States

| State | Description |
|-------|-------------|
| Exit | Response delivered; FINTRAC matter concluded or paused |
| Referral | Findings require MSB_INTAKE_AND_REGISTRATION (amendment) or MSB_REVIEW |
| Self-serve | Client proceeds with internal remediation based on response findings |

## Escalation Hooks

- FINTRAC escalation from examination to enforcement
- Findings implicating unregistered MSB activity
- Scope expansion beyond initial FINTRAC request
- Material inconsistency between registration and actual activities

## Escalation Boundary

Escalation from examination to enforcement triggers a scope boundary. Enforcement-stage work is outside this solution and requires separate engagement authorization.
