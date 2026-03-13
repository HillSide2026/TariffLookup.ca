---
id: DOCTRINE-2026-003
title: LL-SB Architecture Doctrine
owner: ML1
status: draft
version: 1.0
created_date: 2026-02-27
last_updated: 2026-02-27
tags: [architecture, governance, authority]

effective_date:
supersedes:

provenance:
  decided_by: ML1
  decided_on: 2026-02-27
  context: Draft architecture doctrine provided for LL-SB system design
---

# LL-SB Architecture Doctrine

**Document ID:** DOCTRINE-2026-003  
**Status:** DRAFT  
**Authority:** ML1

---

## 1. Purpose

The LL-SB Architecture defines the separation of authority, memory, and execution within Levine Law's Second Brain system.

Its purpose is to:
- Preserve ML1 judgment supremacy
- Maintain ML2 as the inspectable system of record
- Ensure System agents enforce without inventing
- Prevent external platforms from becoming de facto doctrine

---

## 2. Architectural Layers

### 2.1 ML1 - Authority Layer

ML1 is the sole authority for:
- Doctrine approval
- Standards and fallback positions
- Risk tolerance
- Exceptions
- Releases

ML1 decisions are binding only once encoded in ML2.

### 2.2 ML2 - System of Record

ML2 is:
- Local-first
- Versioned
- Inspectable
- Diffable
- Durable

ML2 contains canonical artifacts including:
- Templates
- Playbooks
- Risk registers
- Escalation triggers
- Fallback ladders
- Decision provenance
- Change logs

**Doctrine Rule 1:** ML2 is the source of truth. No external platform supersedes ML2.

### 2.3 System - Enforcement Layer

The System includes:
- Practice-Area Masters
- CFO Agent
- Chief of Staff Agent
- QC gates
- Drift detectors
- Release managers
- Audit loggers

The System:
- Applies ML2
- Flags inconsistencies
- Logs activity
- Produces structured diagnostics

The System does not:
- Create doctrine
- Override ML1
- Autonomously modify ML2

### 2.4 Execution Bridge - Integration Layer

The Execution Bridge connects ML2 to:
- Office 365
- Google Workspace

External platforms are execution surfaces. They are not authoritative repositories.

### 2.5 LL - Human Execution Layer

LL personnel:
- Use ML2-derived artifacts
- Operate through controlled checklists
- Execute within gated workflows

LL receives:
- Approved artifacts
- Versioned outputs

LL does not receive:
- Agent-generated policy
- Unapproved interpretations

---

## 3. Control Principles

### 3.1 Canonical vs Published

Canonical = Stored in ML2  
Published = Distributed to external suites

Published artifacts are operational copies. Canonical artifacts govern.

### 3.2 No Silent Doctrine

No artifact becomes canonical without:
- Diff analysis
- ML1 approval
- Version increment
- Change log entry

---

## 4. Authority Flow

ML1 -> ML2 -> System -> Execution Bridge -> LL

Reversal of authority flow is prohibited.

---

## 5. Information Flow

LL + External Suites -> System Diagnostics -> ML1 Review -> ML2 Update (if approved)

---

## 6. Architectural Invariants

The following must never occur:
- External document silently replacing canonical template
- Agent decision treated as doctrine
- Drift without detection
- Versionless artifact reuse

Violation of invariants triggers architectural review.
