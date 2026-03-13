---
id: PRO-007
title: Coherence Conflict Check
owner: ML1
status: active
version: 1.0
created_date: 2026-02-13
last_updated: 2026-02-13
tags: [protocol]
---

# PRO-007 — Coherence Conflict Check

Enforces Policy: POL-007

Trigger condition: New or updated artifact at a layer with existing active artifacts.
Enforcement rule: If a conflict is detected, flag and block promotion until supersession or reconciliation is recorded.
Block condition: conflict_detected == true.
Escalation path: Escalate to ML1 with conflict summary and proposed resolution.
Logging requirement: Record conflict details, affected artifacts, and resolution status.
Version: 1.0
Status: Active
