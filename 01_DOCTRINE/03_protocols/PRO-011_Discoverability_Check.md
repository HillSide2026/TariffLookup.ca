---
id: PRO-011
title: Discoverability Check
owner: ML1
status: active
version: 1.0
created_date: 2026-02-13
last_updated: 2026-02-13
tags: [protocol]
---

# PRO-011 — Discoverability Check

Enforces Policy: POL-011

Trigger condition: New artifact created or moved.
Enforcement rule: If the artifact is not indexed at its layer, flag and block Active status until indexed.
Block condition: indexed == false.
Escalation path: Escalate to ML1 with indexing instructions.
Logging requirement: Record missing index references and update status.
Version: 1.0
Status: Active
