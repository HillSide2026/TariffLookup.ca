---
id: PRO-006
title: Clarity & Scope Check
owner: ML1
status: active
version: 1.0
created_date: 2026-02-13
last_updated: 2026-02-13
tags: [protocol]
---

# PRO-006 — Clarity & Scope Check

Enforces Policy: POL-006

Trigger condition: Artifact is created, updated, or proposed for promotion.
Enforcement rule: If purpose or scope is missing or ambiguous, flag a quality defect and block promotion to Active status.
Block condition: purpose_missing == true OR scope_missing == true OR single_job_declared == false.
Escalation path: Escalate to ML1 with the artifact and requested clarifications.
Logging requirement: Record the defect, artifact path, and required changes in the run or audit log.
Version: 1.0
Status: Active
