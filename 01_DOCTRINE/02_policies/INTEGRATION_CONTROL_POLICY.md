---
id: 01_doctrine__02_policies__integration_control_policy_md
title: Integration Control Policy
owner: ML1
status: draft
version: 1.0
created_date: 2026-02-27
last_updated: 2026-02-27
tags: [integration, policy, control]
---

# Integration Control Policy

(Operational Control Specification)

This is the enforceable layer.

---

## 0. Precedence

For operational external writes, this policy **supersedes** `WRITE_BACK_POLICY.md`.
Only explicit hard prohibitions defined as invariants remain controlling.

---

## 1. Data Classification

### 1.1 Canonical Data (ML2 Only)

- Templates
- Playbooks
- Risk registers
- Fallback ladders
- Governance documents

Cannot be modified externally.

### 1.2 Published Data

- Working drafts
- Client deliverables
- Internal collaboration copies

Editable externally but non-authoritative.

---

## 2. Read Controls

Agents may read external documents when:
- Triggered by QC gate
- Requested by ML1
- Required for drift detection

Bulk ingestion prohibited unless approved.

---

## 3. Write Controls

All writes must:
- Be to designated folders/sites
- Include artifact version reference
- Include "Derived from ML2 vX.Y" label
- Avoid modifying canonical paths

No direct writes into ML2 from external suites.

---

## 4. Folder & Site Segmentation

External platforms must maintain:
- /Published Templates/
- /Working Drafts/
- /Candidate for Promotion/
- /Archive/

No canonical artifacts stored outside ML2 repository.

---

## 5. Promotion Workflow (Enforced)

When an external document is proposed for canonical status:

Step 1 — Move to /Candidate for Promotion/  
Step 2 — Automated diff vs canonical  
Step 3 — Structured change summary generated  
Step 4 — ML1 approval recorded  
Step 5 — Version increment in ML2  
Step 6 — Republish to /Published Templates/  

If ML1 does not approve, document remains non-canonical.

---

## 6. Audit Requirements

System must retain:
- 24-month integration activity log minimum
- Diff history for each promoted artifact
- Approval reference ID
- Agent version that executed action

---

## 7. Escalation Triggers

Immediate ML1 escalation if:
- Canonical artifact modified externally
- Version mismatch detected
- Unauthorized write detected
- Drift exceeds threshold
