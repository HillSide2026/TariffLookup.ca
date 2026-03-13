---
id: 02_playbooks__contracts__agents__solution_collision_matrix_md
title: Solution Collision Matrix — Contracts
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Solution Collision Matrix — Contracts

Routing logic when multiple Contract Solutions apply.

---

## NDA_CONFIDENTIALITY x [Any Substantive Agreement]

| Field | Guidance |
|-------|----------|
| **Sequence** | NDA first, then substantive agreement |
| **Rationale** | Confidentiality must be in place before sensitive terms exchanged |
| **Common pattern** | NDA signed during negotiation; superseded by confidentiality clause in final agreement |
| **Common traps** | NDA terms inconsistent with final agreement's confidentiality clause |
| **When to escalate** | NDA contains unusual restrictions that limit the substantive agreement |

---

## SERVICE_AGREEMENT (MSA) x SERVICE_AGREEMENT (SOW)

| Field | Guidance |
|-------|----------|
| **Sequence** | MSA first, SOWs under MSA |
| **Rationale** | MSA establishes framework; SOWs define specific engagements |
| **Common pattern** | MSA executed once; multiple SOWs over time |
| **Common traps** | SOW terms conflicting with MSA; inconsistent termination rights |
| **When to escalate** | SOW materially deviates from MSA risk profile |

---

## VENDOR_AGREEMENT x LICENSING

| Field | Guidance |
|-------|----------|
| **Sequence** | Depends — may be embedded or parallel |
| **Rationale** | Software/IP procurement often combines vendor and license terms |
| **Common pattern** | License terms embedded in vendor agreement as schedule |
| **Common traps** | IP ownership unclear; license scope misaligned with intended use |
| **When to escalate** | IP assignment vs license distinction is unclear |

---

## CUSTOMER_AGREEMENT x LICENSING

| Field | Guidance |
|-------|----------|
| **Sequence** | Parallel or embedded |
| **Rationale** | Client providing product/service may license IP to customer |
| **Common pattern** | License to use deliverables embedded in customer agreement |
| **Common traps** | Over-broad license grant; insufficient IP retention |
| **When to escalate** | Customer claims ownership of client's background IP |

---

## INTERCOMPANY x [Any Solution]

| Field | Guidance |
|-------|----------|
| **Sequence** | INTERCOMPANY overlays the substantive agreement type |
| **Rationale** | Related-party transactions follow standard contract patterns but with additional considerations |
| **Common pattern** | Intercompany services agreement using SERVICE_AGREEMENT frame |
| **Common traps** | Treating intercompany as arm's-length; missing transfer pricing considerations |
| **When to escalate** | Tax implications of intercompany arrangement |

---

## Cross-Practice-Area Collisions

### CONTRACTS x CORPORATE

| Field | Guidance |
|-------|----------|
| **Common pattern** | New entity (CORPORATE) immediately needs vendor/customer contracts |
| **Routing** | Each practice area operates independently; matter may reference both |
| **Status** | Cross-practice-area coordination TBD |

---

## Collision Detection Checklist

| Check | Question |
|-------|----------|
| ☐ | Is an NDA needed before the substantive agreement? |
| ☐ | Is this an MSA/SOW relationship? |
| ☐ | Does the agreement embed licensing terms? |
| ☐ | Are the parties related entities? |
| ☐ | Does this matter also involve a CORPORATE Solution? |
