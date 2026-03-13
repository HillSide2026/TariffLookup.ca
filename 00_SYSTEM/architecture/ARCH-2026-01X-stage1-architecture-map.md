---
id: 00_system__architecture__arch-2026-01x-stage1-architecture-map_md
title: Stage 1 Architecture Map — Integrations & Agent Roles (Draft)
owner: ML1
status: draft
created_date: 2026-01-25
last_updated: 2026-01-25
tags: []
---

# Stage 1 Architecture Map — Integrations & Agent Roles (Draft)

**Status:** Draft (Stage 1)
**Scope:** System-level only (no matter workflows, no doctrine edits)

## Objectives
- Provide a baseline map for read-only integrations and system-level agent roles.
- Clarify data flow boundaries and sequencing dependencies for Stage 2 and Stage 3 work.

## Integration Landscape (Read-Only)

| Integration | Purpose (read-only) | Primary Data Boundary | Notes |
| --- | --- | --- | --- |
| Gmail | Email intake and system-level signal aggregation | Mailbox scope approved by ML1 | No write-back or mutation; read-only requirements pending Stage 2 spec. |
| SharePoint | Document/library discovery and metadata extraction | Site/library scope approved by ML1 | No write-back; access model pending tenant constraints. |
| Microsoft Word | Document content extraction for system-level summaries | Document set defined by ML1 | No write-back; file format handling to be specified. |

## Agent Role Map (Target: 5)

| Agent Role | Primary Responsibilities | Inputs | Outputs | Dependencies |
| --- | --- | --- | --- | --- |
| System Governance Agent | Guardrails, compliance checks, audit expectations | Governance policies, integration scopes | Guardrails artifact, audit checklist draft | Requires Stage 2 scope definitions |
| Portfolio Planning Agent | Roadmap planning, backlog structuring | System inventory, agent outputs | Roadmap updates, prioritization drafts | Needs agent roster + integration inputs |
| Integration Steward Agent | Integration requirements + comparison matrix | Access constraints, system goals | Read-only integration specs, tradeoff matrix | Requires credential/permission clarity |
| Knowledge Curation Agent | Knowledge organization and summaries | Integration outputs, governance inputs | Summaries, indexing recommendations | Depends on read-only data access |
| Runbook & QA Agent | Draft runbooks and execution flows | Agent roster, handoffs | Runbook outlines, QA checks | Needs handoff map + guardrails |

## High-Level Flow (Draft)

1. **Integration Steward Agent** defines read-only specs and access constraints.
2. **System Governance Agent** validates guardrails and audit expectations.
3. **Knowledge Curation Agent** specifies how read-only data is summarized and stored.
4. **Runbook & QA Agent** drafts runbooks for agent workflows.
5. **Portfolio Planning Agent** compiles outputs into roadmap and cadence proposals.

## Guardrails (Stage 1 Baseline)
- No matter-level work or data mutation.
- No doctrine edits or policy changes.
- Read-only integrations only; audit/logging expectations must be documented.

## Open Questions
- Final scope boundaries for Gmail/SharePoint/Word.
- Minimal audit/logging requirements for read-only access.
- Definition of “active agent” for Stage 3 success criteria.
