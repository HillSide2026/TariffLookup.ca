---
id: 02_playbooks__corporate__solutions__shareholder_agreement__solution_assembly_md
title: Solution Assembly: Shareholder Agreement
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Solution Assembly: Shareholder Agreement

---

## Required Inputs

| Input | Notes |
|-------|-------|
| Governing statute | OBCA or CBCA |
| Agreement type | SA or USA (explicit selection required) |
| Number of shareholders | All must sign for USA |
| Shareholder identities | Names and capacities |
| Share classes | All classes for USA |
| Ownership percentages | Voting and economic |
| Desired governance allocation | Who decides what |

---

## Assembly Sequence

1. **Confirm eligibility** against Solution Scope
2. **Confirm governing statute** (OBCA vs CBCA)
3. **Confirm agreement type (SA vs USA)**
   - If intent to restrict directors is unclear → escalate
   - If "partial USA" is suggested → escalate
4. **Select statute- and agreement-type-appropriate framework**
5. **Assemble governance provisions**
   - SA: board-centric governance
   - USA: shareholder-centric governance
6. **Assemble transfer restrictions and exit mechanics**
7. **Insert statutory acknowledgements** (USA only)
8. **Flag and route** any escalation conditions

---

## Conditional Branches

### If SA Selected

- Exclude director power transfer language
- Board retains management authority
- Standard contractual enforcement provisions

### If USA Selected

Include:
- Director power transfer clauses (specify which powers)
- Shareholder liability acknowledgements
- Certificate notation requirements
- Statutory compliance recitals

### Shareholder Count Modules

| Count | Module |
|-------|--------|
| Two shareholders | Deadlock resolution module |
| Three or more | Majority/minority governance module |

---

## Issue Maps

| ID | Name | Relevance |
|----|------|-----------|
| IM-SH-01 | Control & Voting | Governance allocation |
| IM-SH-02 | Economic Rights | Distribution mechanics |
| IM-SH-03 | Exit & Liquidity | Transfer and exit provisions |
| IM-GOV-02 | Director vs Shareholder Authority | Power allocation analysis |

---

## Decision Lenses

| ID | Name | Application |
|----|------|-------------|
| DL-SA-USA-01 | SA vs USA Selection | Agreement type decision |
| DL-GOV-02 | Control vs Economics | When voting and economic diverge |
| DL-RISK-01 | Minority Oppression Surface | Minority shareholder protection |

---

## Regulatory Surfaces

| ID | Name | Jurisdiction |
|----|------|--------------|
| RS-ON-01 | OBCA Compliance | Ontario (USA requirements) |
| RS-FED-01 | CBCA Compliance | Federal (USA requirements) |

---

## Question Banks

| ID | Name | Use Case |
|----|------|----------|
| QB-SHA-CORE | Shareholder Agreement Core | Initial scoping |
| QB-SHA-TYPE | SA vs USA Selection | Agreement type decision |
| QB-GOV-ALLOC | Governance Allocation | Who decides what |
| QB-EXIT | Exit Mechanics | Transfer and liquidity |

---

## Required Gates

| Gate | Purpose |
|------|---------|
| Agreement type confirmation | SA vs USA explicitly confirmed |
| QA review | Internal consistency |
| Statutory compliance check | USA statutory requirements (if USA) |
| Escalation check | No exclusion criteria met |

---

## Assembly Notes

- SA and USA are mutually exclusive; do not blend
- USA requires unanimity — all shareholders, all share classes
- USA liability consequences must be understood before proceeding
- Certificate notation is mandatory for USA
