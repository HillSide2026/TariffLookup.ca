---
id: PRO-005
title: Classification Confidence Gate
owner: ML1
status: active
version: 1.0
created_date: 2026-02-13
last_updated: 2026-02-13
tags: [protocol]
---

# PRO-005 — Classification Confidence Gate

Enforces Policy: POL-005

Trigger condition: Classification or decision confidence is below threshold.
Enforcement rule: If confidence < threshold, then block and escalate.
Block condition: confidence < required_threshold.
Escalation path: Escalate to ML1 with classification evidence and uncertainty.
Logging requirement: Record confidence score and escalation in run log.
Version: 1.0
Status: Active
