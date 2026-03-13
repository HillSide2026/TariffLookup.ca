---
id: 02_playbooks__corporate__solutions__incorporation__solution_assembly_md
title: Solution Assembly: Incorporation
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Solution Assembly: Incorporation

---

## Required Inputs

| Input | Notes |
|-------|-------|
| Incorporation statute | OBCA or CBCA (or client preference + reason) |
| Corporate name | Proposed name or numbered preference |
| Shareholder identities | Founding shareholders |
| Initial directors | Must meet residency requirements |
| Initial officers | If appointed at incorporation |
| Registered office address | Jurisdiction-appropriate requirements |
| Share structure | Standard only (common / simple preferred) |

---

## Assembly Sequence

1. **Confirm eligibility** against Solution Scope
2. **Select statute (OBCA vs CBCA)**
   - If unclear or mixed drivers → escalate
3. **Select incorporation type** (named vs numbered)
4. **Assemble Articles of Incorporation** (statute-appropriate form/content)
5. **Prepare initial share structure** and issuance assumptions
6. **Generate organizational resolutions** (statute-appropriate)
7. **Prepare registers** and minute book shell
8. **Flag and route** any escalation conditions

---

## Conditional Branches

| Condition | Action |
|-----------|--------|
| OBCA selected | Include OBCA-specific filing / form artifacts |
| CBCA selected | Include CBCA-specific filing / form artifacts |
| Multiple shareholders | Include standard share allocation artifact |
| Named corporation | Include NUANS / name clearance artifact (as applicable) |

---

## Issue Maps

| ID | Name | Relevance |
|----|------|-----------|
| IM-ENTITY-01 | Entity Formation | Formation decision points |
| IM-GOV-01 | Initial Governance Setup | Director/officer structure |
| IM-CORP-01 | Corporate Formalities | Authorization requirements |

---

## Decision Lenses

| ID | Name | Application |
|----|------|-------------|
| DL-JURIS-01 | OBCA vs CBCA Selection | Statute selection factors |
| DL-STRUCT-01 | Share Structure Simplicity | When to stay standard vs escalate |

---

## Regulatory Surfaces

| ID | Name | Jurisdiction |
|----|------|--------------|
| RS-ON-01 | OBCA Filings | Ontario |
| RS-FED-01 | CBCA Filings | Federal (Canada) |
| RS-NUANS-01 | Name Search Requirements | Both |

---

## Question Banks

| ID | Name | Use Case |
|----|------|----------|
| QB-INC-CORE | Incorporation Core Questions | Initial scoping |
| QB-INC-STATUTE | Statute Selection Questions | OBCA vs CBCA decision |
| QB-CORP-AUTH | Corporate Authorization Chain | Who approves what |

---

## Required Gates

| Gate | Purpose |
|------|---------|
| QA review | Completeness and statute alignment |
| Escalation check | Confirm no exclusion criteria met |

---

## Assembly Notes

- Artifacts are statute-specific; do not mix OBCA and CBCA forms
- Numbered corporations skip name clearance branch
- Component selection remains judgment-based
