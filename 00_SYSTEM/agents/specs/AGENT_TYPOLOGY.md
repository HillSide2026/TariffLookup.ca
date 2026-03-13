---
id: 00_system__agents__agent_typology_md
title: Agent Typology
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-27
tags: []
---

# Agent Typology

Classification of agents operating within the Second Brain system.

---

## Purpose

Define the distinct categories of agents, their roles, authority boundaries, and relationships to system resources. This typology governs how agents are instantiated, configured, and constrained.

This document reflects the current state of the system and explicitly identifies planned but not yet implemented agent types.

---

## Agent Lifecycle States

**Draft** — defined but not instantiated  
**Planned** — concept approved but not implemented  
**Active** — instantiated and operating  
**Deprecated** — no longer used but retained for record  
**Archived** — retired and removed from active registry  

**Requirement:** All agent status values in this document must use **only** these lifecycle states.

---

## Agents Index (Derived from AGENTS.md)

Generated on 2026-02-26.

### System Management Agents (SMA)

| Agent | Class | Status | Path | Notes |
| --- | --- | --- | --- | --- |
| SMA-001 — System Governance | SMA | Active | `00_SYSTEM/AGENTS/SMA-001_SYSTEM_GOVERNANCE.md` | evidence: 06_RUNS/RUN-2026-02-27-SYSTEM-MANAGEMENT-SWEEP-001122Z/system_management/SMA-001_SYSTEM_GOVERNANCE_REPORT.md |
| SMA-002 — Portfolio Planning | SMA | Active | `00_SYSTEM/AGENTS/SMA-002_PORTFOLIO_PLANNING.md` | evidence: 06_RUNS/RUN-2026-02-27-SYSTEM-MANAGEMENT-SWEEP-001122Z/system_management/SMA-002_PORTFOLIO_PLANNING_REPORT.md; 06_RUNS/RUN-2026-02-26-SMA-002-BACKLOG-SCAN-063539Z/portfolio_planning/ |
| SMA-003 — Integration Steward | SMA | Active | `00_SYSTEM/AGENTS/SMA-003_INTEGRATION_STEWARD.md` | evidence: 06_RUNS/RUN-2026-02-27-SYSTEM-MANAGEMENT-SWEEP-001122Z/system_management/SMA-003_INTEGRATION_STEWARD_REPORT.md |
| SMA-004 — Knowledge Curation | SMA | Active | `00_SYSTEM/AGENTS/SMA-004_KNOWLEDGE_CURATION.md` | evidence: 06_RUNS/RUN-2026-02-27-SYSTEM-MANAGEMENT-SWEEP-001122Z/system_management/SMA-004_KNOWLEDGE_CURATION_REPORT.md |
| SMA-005 — Runbook & QA | SMA | Active | `00_SYSTEM/AGENTS/SMA-005_RUNBOOK_QA.md` | evidence: 06_RUNS/RUN-2026-02-27-SYSTEM-MANAGEMENT-SWEEP-001122Z/system_management/SMA-005_RUNBOOK_QA_REPORT.md |
| SMA-006 — System Librarian | SMA | Planned | `00_SYSTEM/AGENTS/SMA-006_SYSTEM_LIBRARIAN.md` |  |

### Levine Law Management Agents (LLM)

| Agent | Class | Status | Path | Notes |
| --- | --- | --- | --- | --- |
| LLM-001 — Chief of Staff | LLM | Planned | `00_SYSTEM/AGENTS/LLM-001_CHIEF_OF_STAFF.md` |  |
| LLM-003 — CFO Agent | LLM | Planned | `00_SYSTEM/AGENTS/LLM-003_CFO_AGENT.md` |  |
| LLM-004 — Project Management Agent | LLM | draft | `00_SYSTEM/AGENTS/LLM-004_PROJECT_MANAGEMENT_AGENT.md` |  |
| LLM-005 — Portfolio Management Agent | LLM | draft | `00_SYSTEM/AGENTS/LLM-005_PORTFOLIO_MANAGEMENT_AGENT.md` |  |
| LLM-006 — Portfolio Governance Agent | LLM | draft | `00_SYSTEM/AGENTS/LLM-006_PORTFOLIO_GOVERNANCE_AGENT.md` |  |

### System Admin Agents (SAA)

| Agent | Class | Status | Path | Notes |
| --- | --- | --- | --- | --- |
| Proto-Agent Charter - Folder Map Drift | SAA | Active | `00_SYSTEM/AGENTS/specs/system_admin/SAA_FOLDER_MAP_DRIFT.md` |  |
| Proto-Agent Charter - Agent Index Reconciler | SAA | Active | `00_SYSTEM/AGENTS/specs/system_admin/SAA_AGENT_INDEX_RECONCILER.md` |  |
| Proto-Agent Charter - Metadata Enforcer | SAA | Active | `00_SYSTEM/AGENTS/specs/system_admin/SAA_METADATA_ENFORCER.md` |  |
| Proto-Agent Charter - Reference Integrity | SAA | Active | `00_SYSTEM/AGENTS/specs/system_admin/SAA_REFERENCE_INTEGRITY.md` |  |
| Proto-Agent Charter - Registry Sync | SAA | Active | `00_SYSTEM/AGENTS/specs/system_admin/SAA_REGISTRY_SYNC.md` |  |
| Proto-Agent Charter - Repo Linter | SAA | Active | `00_SYSTEM/AGENTS/specs/system_admin/SAA_REPO_LINTER.md` |  |

### Practice Area Master Agents

| Agent | Class | Status | Path | Canonical Path Confirmed (Y/N) | Notes |
| --- | --- | --- | --- | --- | --- |
| Contracts Master Agent — Expert Spec (Ontario) | PRACTICE_MASTER | draft | `02_PLAYBOOKS/CONTRACTS/AGENTS/CONTRACTS_MASTER_AGENT.md` | Y | canonical |
| (duplicate) | PRACTICE_MASTER | draft | `02_PLAYBOOKS/substantive/contracts/agents/CONTRACTS_MASTER_AGENT.md` | N | duplicate path (invalid until resolved) |
| Corporate Law Master Agent — Expert Spec (Ontario) | PRACTICE_MASTER | draft | `02_PLAYBOOKS/CORPORATE/AGENTS/CORPORATE_LAW_MASTER_AGENT.md` | Y | canonical |
| (duplicate) | PRACTICE_MASTER | draft | `02_PLAYBOOKS/substantive/corporate/agents/CORPORATE_LAW_MASTER_AGENT.md` | N | duplicate path (invalid until resolved) |
| Payment Services Master Agent — Expert Spec (Canada) | PRACTICE_MASTER | draft | `02_PLAYBOOKS/FINANCIAL_SERVICES/PAYMENTS/AGENTS/PAYMENTSERVICES_MASTER_AGENT.md` | Y | canonical |
| (duplicate) | PRACTICE_MASTER | draft | `02_PLAYBOOKS/substantive/financial_services/payments/agents/PAYMENTSERVICES_MASTER_AGENT.md` | N | duplicate path (invalid until resolved) |

### Other Agent Specs

| Agent | Class | Status | Path | Notes |
| --- | --- | --- | --- | --- |
| Matter Management Agent — Stage 2.11 | SMA | draft | `00_SYSTEM/AGENTS/specs/AGENT__MATTER_MANAGEMENT__STAGE_2_11.md` |  |
| AGENT SPEC — Matter Operations Queue Tracker | SMA | draft | `00_SYSTEM/AGENT_SPEC-MATTER_OPERATIONS_QUEUE_TRACKER.md` |  |
| AGENT SPEC — Matter Operations Queue Tracker | SMA | draft | `04_INITIATIVES/LL_PORTFOLIO/03_FIRM_OPERATIONS/AGENT_SPEC-MATTER_OPERATIONS_QUEUE_TRACKER.md` |  |

### Agent Frameworks (Not Agents)

| Document | Status | Path | Notes |
| --- | --- | --- | --- |
| Agent Typology | draft | `00_SYSTEM/AGENTS/specs/AGENT_TYPOLOGY.md` |  |
| Practice Area Master Agent — Spec v1.0 | draft | `00_SYSTEM/AGENTS/specs/PRACTICE_AREA_MASTER_AGENT_SPEC.md` |  |

### Referenced but Missing Specs

None.

---

## Type 1: System Agents

### Definition

System Agents perform **infrastructure, operational, and coordination functions** across the Second Brain system. They do not exercise domain-specific professional judgment.

### Characteristics

| Attribute | Value |
|-----------|-------|
| Domain expertise | None (domain-agnostic) |
| Judgment authority | Operational only |
| Output type | System artifacts, logs, indices, reports |
| Solution access | None |
| Escalation target | System administrator / ML1 |

### Constraints

- May not interpret legal, business, or domain-specific facts
- Outputs are operational, not advisory

### Governing Doctrine

- [DOCTRINE-AGENTS-0001](../../01_DOCTRINE/01_invariants/DOCTRINE-AGENTS-0001-SECOND-BRAIN_AGENT_AUTHORITY.md)
- [AGENT-CAPABILITY-PROFILE-0001](../../01_DOCTRINE/03_capability_profiles/AGENT-CAPABILITY-PROFILE-0001-DRAFT_WRITE_ACCESS.md)

---

## Type 2: Practice Area Master Agents (Current State)

### Definition

Practice Area Master Agents are **practice-area-scoped coordinating agents** responsible for:

- Intake interpretation within a practice area
- Routing matters to appropriate Solutions
- Ensuring outputs conform to Solution structure and constraints
- Escalating to ML1 when Solution boundaries are exceeded

They are **not** delivery systems.

They currently combine:
- Some system-level coordination
- Some domain awareness
- Some provisional delivery logic

**This role is explicitly transitional.**

### Characteristics (Current)

| Attribute | Value |
|-----------|-------|
| Domain expertise | Practice-area contextual understanding |
| Judgment authority | Solution selection + bounded expert reasoning |
| Output type | Matter framing, solution selection, escalation questions |
| Solution access | Full access to practice area Solutions |
| Escalation target | ML1 / human authority |

### Constraints

- May not act outside approved Solutions
- May not override Solution scope without escalation
- Must use mandatory output schema
- May not assume firm-wide delivery authority

### Examples

| Agent | Practice Area |
|-------|---------------|
| CORPORATE_LAW_MASTER_AGENT | Corporate |
| CONTRACTS_MASTER_AGENT | Contracts |
| PAYMENTSERVICES_MASTER_AGENT | Payments |

### Governing Specification

- [PRACTICE_AREA_MASTER_AGENT_SPEC.md](PRACTICE_AREA_MASTER_AGENT_SPEC.md)

### Canonical Path Rule (Mandatory)

- Each Practice Area Master Agent must have **exactly one canonical path**.
- Duplicate paths are **invalid** and must be resolved.
- The index must explicitly mark **Canonical Path Confirmed (Y/N)** for each entry.

---

## Type 3: Solution-Area Specialist Agents (To Be Implemented)

### Definition

Solution-Area Specialist Agents are **narrow, bounded expert agents** instantiated to operate inside a single Solution packet.

They provide **solution-local advisory signal only**.

They do not manage engagements, escalation, or delivery relationships.

### Characteristics

| Attribute | Value |
|-----------|-------|
| Domain expertise | Deep, solution-specific |
| Judgment authority | None (advisory only) |
| Output type | Flags, observations, artifact references |
| Solution access | Single Solution only |
| Escalation authority | None |
| Escalation target | Practice Area Master Agent |

### Constraints

- May not select or change Solutions
- May not escalate directly to ML1
- May not reinterpret system doctrine
- All outputs are advisory and non-binding

---

## Relationship Between Agent Types (Target State)

```
┌─────────────────────────────────────────────────────────────┐
│                     ML1 / Human Authority                    │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │ escalates to
┌─────────────────────────────────────────────────────────────┐
│              Type 2: Practice Area Master Agents             │
│                                                              │
│  • Solution routing                                          │
│  • Practice-area framing                                     │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │ request analysis and production from
┌─────────────────────────────────────────────────────────────┐
│            Type 3: Solution-Area Specialist Agents            │
│                                                              │
│  • Advisory only                                             │
│  • Single Solution scope                                     │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │ supported by
┌─────────────────────────────────────────────────────────────┐
│                  Type 1: System Agents                        │
│                                                              │
│  • Operational functions                                     │
│  • No domain judgment                                        │
│  • Infrastructure, routing, reporting                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Invariant (System Rule)

> Practice areas coordinate work via one or more solution. Solutions confirm scope and generate signal. Human retains authority.

---

## Key Distinctions

| Dimension | Type 1 (System) | Type 2 (Practice Area Master) | Type 3 (Solution Specialist) |
|-----------|-----------------|-------------------------------|------------------------------|
| Expertise | None | Practice-area contextual | Deep, solution-specific |
| Judgment | Operational | Solution selection + bounded reasoning | None (advisory only) |
| Solutions | Not used | Full practice area access | Single Solution only |
| Output schema | Flexible | Mandatory | Flags + observations |
| Confidence scoring | Optional | Required | N/A |
| Assumption budget | N/A | Max 3 | N/A |
| Escalation target | ML1 / system admin | ML1 | Practice Area Master Agent |
| Escalation authority | Operational issues | Domain judgment + constraints | None |

---

## Implication (Important)

Until Type 4 (Delivery System) is implemented:

- Practice Area Master Agents are operating in a **hybrid role**
- Delivery logic is necessarily **incomplete**
- Escalation risk is mitigated only by **human review**

---

## Instantiation

### Type 1 Agents
Instantiated by system configuration. No practice-area-specific parameters required.

### Type 2 Agents
Instantiated per practice area by:
1. Applying the generic [PRACTICE_AREA_MASTER_AGENT_SPEC.md](PRACTICE_AREA_MASTER_AGENT_SPEC.md)
2. Binding to the practice area's Solution library
3. Configuring practice-area-specific:
   - Decision registry (named decision points)
   - Known-safe defaults
   - Intake question packs
   - Collision matrix (if multi-solution)

### Type 3 Agents
To be implemented. Instantiation pattern TBD — expected to require:
1. Binding to a single Solution packet
2. Defining advisory output format (flags, observations, artifact references)
3. Registering under the parent Practice Area Master Agent

---

## Index

### Type 1 Agents

| Agent | Class | Location | Status |
|-------|-------|----------|--------|
| todo-rollup | SMA | 00_SYSTEM/scripts/todo_rollup.py | Active |
| system-governance | SMA | TBD | Planned |
| project-manager | SMA | TBD | Planned |

### Type 2 Agents

| Agent | Class | Practice Area | Location | Status |
|-------|-------|---------------|----------|--------|
| CORPORATE_LAW_MASTER_AGENT | PRACTICE_MASTER | Corporate (Ontario) | 02_PLAYBOOKS/substantive/corporate/agents/ | Active |
| CONTRACTS_MASTER_AGENT | PRACTICE_MASTER | Contracts | 02_PLAYBOOKS/substantive/contracts/agents/ | Active |
| PAYMENTSERVICES_MASTER_AGENT | PRACTICE_MASTER | Payments | 02_PLAYBOOKS/substantive/financial_services/payments/agents/ | Active |

### Type 3 Agents

No Type 3 agents have been instantiated. This type is planned.

---

## Adding New Agents

### Type 1
1. Define operational function
2. Specify inputs/outputs
3. Grant capability profile if write access needed
4. No Solution binding required

### Type 2
1. Apply PRACTICE_AREA_MASTER_AGENT_SPEC.md
2. Define practice-area Solutions
3. Configure decision registry, defaults, intake packs
4. Grant capability profile
5. Register in typology index

### Type 3
1. Bind to single Solution packet
2. Define advisory output format
3. Register under parent Practice Area Master Agent
4. No escalation authority granted
