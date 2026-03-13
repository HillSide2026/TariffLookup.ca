---
id: DOCTRINE-2026-008
title: Integration Doctrine (External Platform Governance)
owner: ML1
status: draft
version: 1.0
created_date: 2026-02-27
last_updated: 2026-02-27
tags: [integration, governance, execution]

effective_date:
supersedes:

provenance:
  decided_by: ML1
  decided_on: 2026-02-27
  context: Draft doctrine governing external platform integrations
---

# Integration Doctrine

**Document ID:** DOCTRINE-2026-008  
**Status:** DRAFT  
**Authority:** ML1

---

## 1. Purpose

To govern how ML2 interacts with Office 365 and Google Workspace.  
To ensure integrations increase leverage without compromising authority integrity.

---

## 2. Classification of External Platforms

Office 365 and Google Workspace are classified as:
- Tier-2 Execution Surfaces

They are:
- Collaborative environments
- Distribution layers
- Communication tools

They are not:
- Canonical repositories
- Doctrine authorities
- Approval systems

---

## 3. Allowed Integration Actions

### 3.1 Read Permissions

Permitted when:
- Required for QC review
- Required for template population
- Required for drift detection
- Explicitly authorized in integration control policy

### 3.2 Write Permissions

Permitted only for:
- Publishing derived artifacts
- Updating approved distributed templates
- Writing structured outputs tied to ML2 version references

All writes must:
- Include version metadata
- Log artifact ID
- Log timestamp
- Log triggering agent

---

## 4. Prohibited Behaviors

- Overwriting canonical ML2 artifacts
- Treating a shared Google Doc as authoritative
- Auto-promoting edited documents to canonical status
- Allowing undocumented edits to alter doctrine

---

## 5. Promotion Requirement

External edits become candidates only. They require:
- Candidate flag
- Diff vs canonical
- ML1 approval
- Version increment
- Republish

No bypass permitted.

---

## 6. Integration Logging

Every integration event must log:
- Source platform
- Target artifact
- Artifact version
- Change summary
- Initiating agent or human
- Approval reference (if applicable)

Logs must be auditable.
