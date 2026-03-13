---
id: qa-practice-areas-2026-02-09
title: QA Report - Practice Areas
owner: ML1
status: draft
created_date: 2026-02-09
last_updated: 2026-02-09
tags: []
---

# QA Report - Practice Areas

## Scope
- Root: `02_PLAYBOOKS/`
- Checks: broken internal links, agent spec schema presence

## Summary
- Markdown files scanned: 133
- Broken internal links: 6
- Agent specs scanned: 3
- Agent specs missing required sections: 3
- Agent specs missing reference to PRACTICE_AREA_MASTER_AGENT_SPEC: 1

## Findings
### Broken Internal Links (High)
- 02_PLAYBOOKS/substantive/financial_services/payments/agents/README.md — `../../../00_SYSTEM/agents/specs/PRACTICE_AREA_MASTER_AGENT_SPEC.md` (missing_target)
- 02_PLAYBOOKS/substantive/financial_services/payments/agents/README.md — `../../../00_SYSTEM/agents/specs/AGENT_TYPOLOGY.md` (missing_target)
- 02_PLAYBOOKS/substantive/financial_services/payments/agents/PAYMENTSERVICES_MASTER_AGENT.md — `../../../00_SYSTEM/agents/specs/PRACTICE_AREA_MASTER_AGENT_SPEC.md` (missing_target)
- 02_PLAYBOOKS/substantive/financial_services/payments/agents/PAYMENTSERVICES_MASTER_AGENT.md — `../../../00_SYSTEM/agents/specs/PRACTICE_AREA_MASTER_AGENT_SPEC.md` (missing_target)
- 02_PLAYBOOKS/substantive/financial_services/payments/agents/PAYMENTSERVICES_MASTER_AGENT.md — `../../../01_DOCTRINE/01_invariants/DOCTRINE-AGENTS-0001-SECOND-BRAIN_AGENT_AUTHORITY.md` (missing_target)
- 02_PLAYBOOKS/substantive/financial_services/payments/agents/PAYMENTSERVICES_MASTER_AGENT.md — `../../../00_SYSTEM/agents/specs/AGENT_TYPOLOGY.md` (missing_target)

### Agent Specs Missing Required Sections (Medium)
- 02_PLAYBOOKS/substantive/corporate/agents/CORPORATE_LAW_MASTER_AGENT.md — missing: Decision Registry, Execution Plan, Risks & Failure Modes
- 02_PLAYBOOKS/substantive/financial_services/payments/agents/PAYMENTSERVICES_MASTER_AGENT.md — missing: Decision Registry, Execution Plan, Risks & Failure Modes
- 02_PLAYBOOKS/substantive/contracts/agents/CONTRACTS_MASTER_AGENT.md — missing: Decision Registry, Execution Plan, Risks & Failure Modes

### Agent Specs Missing Spec Reference (Low)
- 02_PLAYBOOKS/substantive/corporate/agents/CORPORATE_LAW_MASTER_AGENT.md

## Notes
- Anchor validation is based on simple GitHub-style slugging; false positives possible for custom anchors.
- Section checks are string-based and do not validate order or completeness of content.

## ML1 Policy Questions
- Confirm required sections for practice-area agent specs (currently inferred from `00_SYSTEM/agents/specs/PRACTICE_AREA_MASTER_AGENT_SPEC.md`).