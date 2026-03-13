---
id: 04_initiatives__system_portfolio__backlog_md
title: System Portfolio Backlog
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-10
tags: []
---

# System Portfolio Backlog

## Purpose
Centralized backlog for System Portfolio initiatives. Items here are candidates for
inclusion in active roadmaps but do not authorize execution by themselves.

## Backlog Rules
- Items must include: description, owner (or TBD), and dependencies (if any)
- Items are prioritized by ML1; agents may propose but not reorder
- Promoted items move to active roadmap stages; completed items are removed or archived
- Backlog does not create doctrine or authorize execution

---

## Candidate Items

| ID | Description | Owner | Dependencies | Priority | Status |
|----|-------------|-------|--------------|----------|--------|
| SYS-001 | Choose and implement agent runtime (Claude Code agents, MCP servers, or custom SDK) | ML1 | Stage 3 agent roster | P0 | candidate |
| SYS-002 | Set up Gmail read-only integration (OAuth app, scopes, audit logging) | Integration Steward | Stage 2 specs, SYS-001 | P1 | candidate |
| SYS-003 | Set up SharePoint read-only integration (Graph API, site scopes) | Integration Steward | Stage 2 specs, SYS-001 | P1 | candidate |
| SYS-004 | Set up Word/OneDrive read-only integration (document access) | Integration Steward | Stage 2 specs, SYS-001 | P1 | candidate |
| SMA-001 | Deploy and configure System Governance Agent | Runbook & QA | SYS-001 | P1 | candidate |
| SMA-002 | Deploy and configure Portfolio Planning Agent | Runbook & QA | SYS-001 | P1 | candidate |
| SMA-003 | Deploy and configure Integration Steward Agent | Runbook & QA | SYS-001 | P1 | candidate |
| SMA-004 | Deploy and configure Knowledge Curation Agent | Runbook & QA | SYS-001 | P1 | candidate |
| SMA-005 | Deploy and configure Runbook & QA Agent | Runbook & QA | SYS-001 | P1 | candidate |
| SYS-010 | Execute first operating cycle (weekly cadence test) | All Agents | SMA-001 to SMA-005 | P2 | candidate |
| SYS-011 | Archive completed Stage 3 + Stage 4 artifacts | Knowledge Curation | Stage closures approved | P2 | candidate |

---

## Priority Legend
- **P0**: Blocking — must resolve before other work proceeds
- **P1**: High — core functionality, schedule ASAP
- **P2**: Medium — important but not blocking
- **P3**: Low — nice to have, schedule when capacity allows

---

## Recently Completed (for reference)
- **Stage 1**: System Discovery & Readiness Baseline — archived
- **Stage 2**: Read-Only Integration Foundation — archived
- **Stage 3**: System-Level Agent Orchestration — READY_FOR_CLOSURE
- **Stage 4**: Portfolio Operating Rhythm — OUTSTANDING

## How to Add Items
1. Add a row to the Candidate Items table
2. Assign an ID (sequential: SYS-001, SYS-002, etc.)
3. Leave Status as `candidate` until promoted to a roadmap stage
