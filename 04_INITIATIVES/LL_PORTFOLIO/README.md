---
id: 04_initiatives__ll_portfolio__readme_md
title: LL_PORTFOLIO — Levine Law Workstream Registry
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# LL_PORTFOLIO — Levine Law Workstream Registry

## Meta-Rule

> **ML2 preserves ML1 intent. It does not approximate, infer, or replace it.**
>
> **When in doubt: STOP. LABEL. ESCALATE.**

---

## Core Definition

The LL Portfolio is a **governed, non-autonomous registry** where:

- **ML1** is the sole authority for judgment, approval, pricing, and strategy
- **ML2** preserves structure, scope, constraints, and state
- **LL** consumes ONLY ML1-approved outputs

---

## Canonical Structure (LOCKED)

```
LL_PORTFOLIO/
├── README.md                    ← You are here (authoritative)
├── 01_ACCOUNTING/               # Historical fact
├── 02_PRACTICE_AREAS/           # Durable legal operating knowledge
├── 03_FIRM_OPERATIONS/          # How the firm runs
├── 04_RISK_COMPLIANCE/          # Defensive clarity
├── 05_MATTER_DOCKETING/         # Delivery overlay for matters
├── 06_FINANCIAL_PORTFOLIO/      # Models & constraints (not decisions)
├── 07_STRATEGIC_INITIATIVES/    # Change and evolution
└── 08_MARKETING/                # Pre-matter pipeline (leads → onboarding)
```

**This structure is LOCKED unless explicitly changed by ML1.**

You must not infer, reorder, merge, or repurpose these folders.

---

## Portfolio Definitions

### 01_ACCOUNTING (Historical Fact)

**Purpose:** Record what already happened.

**Characteristics:** Backward-looking, factual, non-interpretive

| ALLOWED | PROHIBITED |
|---------|------------|
| Bookkeeping records | Forecasting |
| Historical financial statements | Scenario modeling |
| Reconciliations | Pricing logic |
| Invoices, payments, expense logs | Recommendations, optimization |

**Rule:** If it could influence a future decision, it DOES NOT belong here.

---

### 02_PRACTICE_AREAS

**Purpose:** Durable legal operating knowledge by domain.

| ALLOWED | PROHIBITED |
|---------|------------|
| Playbooks, checklists, standards | Client-specific material |
| ML1-approved doctrine | Pricing, strategy |
| Version tracking | "Common practice" as authority |

---

### 03_FIRM_OPERATIONS

**Purpose:** How the firm runs day-to-day.

| ALLOWED | PROHIBITED |
|---------|------------|
| SOPs | Policy decisions |
| Process documentation | Enforcement without ML1 approval |
| Templates, internal workflows | Financial modeling |

---

### 04_RISK_COMPLIANCE

**Purpose:** Defensive clarity and audit readiness.

| ALLOWED | PROHIBITED |
|---------|------------|
| Risk registers | Declaring compliance status |
| Compliance doctrines | Closing issues autonomously |
| Violation tracking, resolution logs | Waiving controls |

---

### 05_MATTER_DOCKETING

**Purpose:** Delivery and docketing overlay for matters in the system of record.

| ALLOWED | PROHIBITED |
|---------|------------|
| Matter State tracking (delivery posture) | Billing, accounting, collections |
| Activity Period tagging | CRM, intake, sales, pre-engagement |
| Delivery-related lawyer to-dos | Pricing, strategy, financial modeling |
| Email-to-operations-queue event mapping | Modifying Clio source-of-truth fields |
| Suggested operations queue transitions (ML1 approval required) | Auto-applying State/Period changes without authorization |

---

### 06_FINANCIAL_PORTFOLIO (Models & Constraints)

**Purpose:** Financial visibility and modeling WITHOUT decision authority.

**Characteristics:** Analytical, assumption-bound, advisory only

| ALLOWED | PROHIBITED |
|---------|------------|
| Revenue and pricing frameworks | Setting prices |
| Unit economics | Approving discounts |
| Cost models | Declaring profitability |
| Scenario and sensitivity analysis | Auto-feeding outputs into operations/sales |
| Financial constraints (e.g., margin floors) | Treating models as decisions |

**Critical Boundary:**
- Accounting = facts
- Financial Portfolio = models
- **They must never be mixed.**

---

### 07_STRATEGIC_INITIATIVES

**Purpose:** Change, experimentation, and future direction.

**Characteristics:** Explicitly NON-AUTHORITATIVE until approved, judgment-heavy

| ALLOWED | PROHIBITED |
|---------|------------|
| Strategy drafts | Operating rules |
| Tradeoff analysis | Execution |
| Scenario exploration | Silent promotion into operations or pricing |

---

### 08_MARKETING

**Purpose:** Pre-matter pipeline for how potential work enters the firm.

**Characteristics:** Pre-matter only, ends at matter opening, no delivery semantics

| ALLOWED | PROHIBITED |
|---------|------------|
| Lead capture and tracking | Legal delivery work |
| Intake qualification | Docketing or capacity management |
| Onboarding workflow | Modifying delivery states or periods |
| Conversion analytics | Billing, accounting, pricing decisions |
| Handoff to Matter Docketing | Accepting/rejecting work autonomously |

**Critical Boundary:**
- Marketing ends when a matter is opened
- Matter Docketing begins when a matter exists
- **They must not overlap.**

---

## README Requirement (Mandatory)

Each folder under LL_PORTFOLIO must contain a README.md stating:

- Purpose
- Scope
- ML1 authority statement
- Explicit prohibitions
- Approval state
- Last ML1 review date

**If a README is missing or outdated:**
- Treat the folder as READ-ONLY
- Do not generate new outputs
- Escalate to ML1

---

## Enforcement Rule

If authorization is unclear:

**STOP. FLAG. ESCALATE TO ML1.**

---

## References

- 04_INITIATIVES Overview: `../README.md`
- Folder Map: `00_SYSTEM/architecture/FOLDER_MAP.md`
- Authority Hierarchy: `01_DOCTRINE/DOCTRINE-2026-002-authority-hierarchy-ml1-ml2-ll.md`
