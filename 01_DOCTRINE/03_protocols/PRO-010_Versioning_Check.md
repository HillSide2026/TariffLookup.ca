---
id: PRO-010
title: Versioning Check
owner: ML1
status: active
version: 1.0
created_date: 2026-02-13
last_updated: 2026-02-13
tags: [protocol]
---

# PRO-010 — Versioning Check

Enforces Policy: POL-010

Trigger condition: Artifact change detected.
Enforcement rule: If version or supersession metadata is missing, flag and block promotion to Active status.
Block condition: version_missing == true OR supersession_missing == true.
Escalation path: Escalate to ML1 with required versioning updates.
Logging requirement: Record versioning defects and remediation status in the audit log.
Version: 1.0
Status: Active
