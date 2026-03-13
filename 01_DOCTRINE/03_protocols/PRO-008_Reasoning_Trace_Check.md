---
id: PRO-008
title: Reasoning Trace Check
owner: ML1
status: active
version: 1.0
created_date: 2026-02-13
last_updated: 2026-02-13
tags: [protocol]
---

# PRO-008 — Reasoning Trace Check

Enforces Policy: POL-008

Trigger condition: Output prepared for external release or archival.
Enforcement rule: If reasoning or doctrine references are missing, flag and block external release until added.
Block condition: reasoning_trace_missing == true OR doctrine_reference_missing == true.
Escalation path: Escalate to ML1 with the output and required references.
Logging requirement: Record missing references and block decision in the run log.
Version: 1.0
Status: Active
