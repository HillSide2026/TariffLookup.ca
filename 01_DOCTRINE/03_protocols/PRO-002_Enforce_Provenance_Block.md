---
id: PRO-002
title: Enforce Provenance Block
owner: ML1
status: active
version: 1.0
created_date: 2026-02-13
last_updated: 2026-02-13
tags: [protocol]
---

# PRO-002 — Enforce Provenance Block

Enforces Policy: POL-002

Trigger condition: Output is finalized for storage, release, or execution.
Enforcement rule: If provenance is missing or incomplete, then block release.
Block condition: provenance == null OR provenance lacks PRN/POL/PRO/DOC references.
Escalation path: Escalate to ML1 with request to supply provenance.
Logging requirement: Record block event and missing provenance fields in run log.
Version: 1.0
Status: Active
