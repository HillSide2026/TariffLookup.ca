---
id: 00_system__architecture__system_model_md
title: System Model
owner: ML1
status: draft
version: 1.0
created_date: 2026-02-14
last_updated: 2026-02-19
tags: [architecture, system, boundary, ontology]
---

# System Model

## Purpose

This document defines the architectural model of the LL Second Brain environment.

It clarifies the distinction between:

- ML1 (human authority)
- ML2 (governed ontology)
- The System (execution environment)
- The Repository (transport container)

It also records the current layered architecture and execution flow used by the system.

This document is architectural and interpretive.  
Binding constraints on ML2 are defined in:

`01_DOCTRINE/01_invariants/INV-ML2-BOUNDARY.md`

---

# Core Definitions

## ML1 - Human Authority

ML1 (Matthew Levine) is the sole source of:

- Judgment
- Approval
- Strategic direction
- Exception handling

ML1 is accountable for all system outputs and doctrinal changes.

ML1 is not automated.

---

## ML2 - Governed Ontology

ML2 is the system-of-record for durable knowledge and its operating rules.

ML2 consists exclusively of governed artifacts defined by the ML2 Ontology Boundary invariant.

### ML2 Includes

- Constitution
- Principles
- Policies
- Protocols
- Playbooks
- Templates
- Runs (evidence)
- Integration specifications (non-secret)

ML2 is conceptual.  
It is not defined by its storage medium.

If the execution engine changes, ML2 artifacts remain authoritative.

---

## The System - Execution of ML2

The System is the operational environment that executes, enforces, and maintains ML2.

It consists of:

- ML1 (authority)
- ML2 (ontology)
- Agents (system-management and domain agents)
- Orchestration logic
- Retrieval mechanisms
- Integration adapters
- Runtime infrastructure
- Validation and QA processes

The System enforces ML2.  
It is not itself ML2.

If the execution engine changes, the System may change.  
ML2 must remain intact.

---

## The Repository - Transport Container

The repository is the current storage and execution container for:

- ML2 artifacts
- System implementation components
- Tooling and configuration

The repository is not ML2.

The repository may contain:

- Repo infrastructure (.gitignore, LICENSE, etc.)
- Execution telemetry (logs/)
- Scripts and tooling
- Local configuration
- CI configuration

These are container artifacts and are not governed ontology.

---

# Layered Architecture (Operational)

This layer model is an operational mapping that aligns with the core definitions above.
It does not override the ML2 ontology boundary invariant.

## Layer 1 — ML2 Core (Canonical Knowledge Layer)

Definition: The governed, canonical artifacts that make up ML2.

Identity test:
If automation and integrations are removed, ML2 Core still exists as authoritative knowledge.

Practical mapping in this repository:
- 01_DOCTRINE/
- 02_PLAYBOOKS/
- 03_TEMPLATES/
- 04_INITIATIVES/
- 05_MATTERS/
- 06_RUNS/
- 07_REFERENCE/
- 08_RESEARCH/
- 09_INBOX/
- 10_ARCHIVE/
- 00_SYSTEM/ (governed artifacts only)

Note:
ML2 is conceptual and not defined by its storage medium. The list above is a practical mapping, not a boundary rule.

## Layer 1A — ML2 Configuration (Automation Hub)

Definition: Version-controlled execution configuration stored alongside ML2 Core.

Location:
- .claude/ (commands, hooks, agents configuration)

Purpose:
- Define deterministic execution commands
- Bind AI behavior to canon artifacts
- Enforce doctrine-aligned checks

Important distinction:
Configuration is version-controlled but is not itself ML2 canon.

## Layer 2 — AI Execution Layer

Definition: The runtime intelligence engine (e.g., Claude Code) that reads from ML2 Core, executes commands, applies hooks, and generates outputs.

Characteristics:
- Ephemeral runtime
- Context-aware
- Governed by doctrine and configuration
- Writes only within permitted scope

Layer 2 is behavior, not identity.

## Layer 3 — External Integration Surface

Definition: Connected business tools and systems that exchange information with ML2.

Examples:
- Gmail
- Drive
- SharePoint
- CRM systems
- Project management tools

Characteristics:
- Not part of ML2
- Provide inputs or receive outputs
- May disconnect or degrade without harming ML2 Core

Operational evidence principle (non-binding):
An integration is considered operational only when it produces evidence artifacts inside the repository.

---

# Boundary Principles

## Ontology vs Mechanism

ML2 defines truth and rules.

The System defines how those rules are executed.

Mechanisms may change without altering ontology.

---

## Durable vs Ephemeral

If an artifact would survive migration to a different execution engine as authoritative knowledge, it belongs to ML2.

If it would not survive that migration, it belongs to the System or repository layer.

---

# Execution Flow Model (Operational)

This flow describes current system practice and is not a substitute for binding doctrine.

External Signal  
→ Inbox / Matter / Initiative  
→ Run (AI Execution)  
→ Outcome  
→ Promote / Park / Archive

Run outcome recording (operational):
- `06_RUNS/_RUN_TEMPLATE/OUTCOME.yaml`
- `06_RUNS/99_distill_queue/README.md`

Binding promotion rules remain in:
`01_DOCTRINE/04_procedural/DOCTRINE-2026-003-promotion-rules.md`

---

# Canon Promotion Model (Current vs Proposed)

Current binding model:
Inbox → Research → Doctrine (see DOCTRINE-2026-003).

Proposed ladder (non-binding, requires ML1 approval to formalize):
Research → Template → Playbook → Doctrine.

---

# Integration Model

Integrations have two components:

1. Integration Specifications (ML2)
   - Governed, non-secret
   - Define authority, classification, ingestion rules
   - Located under `00_SYSTEM/integrations/`

2. Integration Mechanisms (System)
   - Adapters, retrieval logic, credentials
   - Runtime-bound
   - May change without altering ontology

Secrets and credentials are never ML2.

---

# Observability Surface

Operational health and status summary:
- `00_SYSTEM/DASHBOARD.md`

The dashboard is expected to surface runs, promotions, distill queue count, and integration status.
Automation for these metrics is not required for this document to remain valid.

---

# Enforcement Implications

- System Admin Agents enforce ML2 boundaries only where defined by invariant.
- Drift detection applies to ML2 layers, not container artifacts.
- Metadata enforcement applies only to governed ontology artifacts.
- Reference validation applies only within ML2 cross-references unless explicitly configured.

---

# Layer Model (Stable Form)

ML1 -> Authority  
ML2 -> Ontology  
System -> Execution of ontology  
Repository -> Transport container

This layering is stable across tooling changes.

---

# Change Control

Changes to this document require explicit ML1 review.

Changes to ML2 boundaries must reference:

`INV-ML2-BOUNDARY.md`
