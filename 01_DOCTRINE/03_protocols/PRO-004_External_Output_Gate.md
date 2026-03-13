---
id: PRO-004
title: External Output Gate
owner: ML1
status: active
version: 1.0
created_date: 2026-02-13
last_updated: 2026-02-13
tags: [protocol]
---

# PRO-004 — External Output Gate

Enforces Policy: POL-004

Trigger condition: Output is intended for external or client-facing release.
Enforcement rule: If ML1 approval artifact is missing, then block release.
Block condition: ml1_approval == false OR approval_artifact == null.
Escalation path: Escalate to ML1 for approval decision.
Logging requirement: Record approval check result and block event in run log.
Version: 1.0
Status: Active
