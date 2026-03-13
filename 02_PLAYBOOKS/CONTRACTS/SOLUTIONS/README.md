---
id: 02_playbooks__contracts__solutions__readme_md
title: Contract Solutions
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-25
tags: []
---

# Contract Solutions

Solution frames for contract law problem spaces.

---

## What is a Solution Frame?

A solution is **not** a guide, template, or procedure.

A solution frame encodes **expert knowledge about a problem space**:
- When it applies (and when it doesn't)
- What components typically assemble into it
- What artifacts are commonly evaluated
- What risks surface frequently

This is expertise without advice.

---

## Solution Frame Structure

Each solution directory contains:

| File | Purpose |
|------|---------|
| `README.md` | What this solution is (and isn't) |
| `SOLUTION_SCOPE.md` | When this solution is relevant |
| `SOLUTION_ASSEMBLY.md` | How the solution draws from other playbook components |
| `COMMON_ARTIFACTS.md` | Categories of documents typically evaluated |
| `RISK_PROFILE.md` | Solution-specific failure modes |

---

## Assembly Logic

Solutions are built by connecting:

- **Issue Maps** — Structured issue taxonomies (IM-*)
- **Decision Lenses** — Analytical frameworks (DL-*)
- **Regulatory Surfaces** — Filing and compliance touchpoints (RS-*)
- **Question Banks** — Discovery and scoping questions (QB-*)

The solution frame specifies *which* components are typically relevant, not *how* to use them.

---

## Primary Branching Axis

Contract Solutions branch on **counterparty position** and **commercial relationship**:

| Axis | Options |
|------|---------|
| Counterparty position | Vendor, Customer, Licensor/Licensee, Related entity |
| Relationship type | One-off, Ongoing/framework (MSA/SOW), Protective (NDA) |

This differs from Corporate, which branches primarily on statute (OBCA/CBCA) and instrument type (SA/USA).

---

## Disclaimers (Present in Every Solution)

- This is not legal advice
- This does not prescribe specific contract language
- Final judgment remains with ML1
- Presence of an artifact does not imply necessity
- Absence does not imply defect

---

## Implemented Solution Folders

The following solution frame folders are implemented in this directory:

- [VENDOR_AGREEMENT/](VENDOR_AGREEMENT/)
- [CUSTOMER_AGREEMENT/](CUSTOMER_AGREEMENT/)
- [SERVICE_AGREEMENT/](SERVICE_AGREEMENT/)
- [NDA_CONFIDENTIALITY/](NDA_CONFIDENTIALITY/)
- [LICENSING/](LICENSING/)
- [INTERCOMPANY/](INTERCOMPANY/)

---

## Index

| # | Solution | Sub-Specs |
|---|----------|-----------|
| 1 | VENDOR_AGREEMENT | Technology Vendor · Professional Services Vendor · Infrastructure / Hosting · White-Label / Platform Vendor · Strategic Vendor (High Dependency) |
| 2 | CUSTOMER_AGREEMENT | B2B Customer Agreement · B2C Terms & Conditions · Enterprise Customer Agreement · Platform / Marketplace Customer · Cross-Border Customer Agreement |
| 3 | SERVICE_AGREEMENT | Managed Services · Professional Services · Consulting / Advisory · Implementation / Integration · Support & Maintenance |
| 4 | NDA_CONFIDENTIALITY | Mutual NDA · One-Way NDA · Investor NDA · Strategic Partner NDA · Employee / Contractor Confidentiality |
| 5 | LICENSING | Software License (Outbound) · Software License (Inbound) · IP Commercialization · Brand / Trademark License · Data / Content License |
| 6 | INTERCOMPANY | Parent–Subsidiary · Sister Company · Cost-Sharing · IP Holding / OpCo · Services & Management Fees |
