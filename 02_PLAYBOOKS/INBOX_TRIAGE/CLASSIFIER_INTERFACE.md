---
id: 02_playbooks__inbox_triage__classifier_interface_md
title: Inbox Classifier Interface Specification
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Inbox Classifier Interface Specification

**Status:** Draft — for ML1 approval
**Stage:** 2.3 — Inbox Intelligence Layer
**Purpose:** Define the inputs and outputs for deterministic inbox classification.
This interface produces proposals only.

---

## 1. Input Contract (Read-Only)

The classifier may consume only the following fields:

### Required Inputs
- `message_id` (string)
- `subject` (string)
- `sender` (email address)
- `snippet` (string, truncated body preview)
- `timestamp` (ISO-8601)
- `labels` (array of strings, read-only)

### Prohibited Inputs
- Full message body persistence
- Attachments (beyond metadata)
- Any mutable Gmail fields

---

## 2. Output Contract

The classifier MUST output exactly one classification record per message.

### Required Outputs
- `message_id`
- `object_type` (from taxonomy)
- `lifecycle_state`
- `system_domain`
- `confidence`
- `reasoning_trace` (≤ 3 short bullet points)
- `proposed_destination_root` (repo root only, e.g. `05_MATTERS`)
- `status` = `proposal_only`
- `model_version` or `ruleset_version`
- `timestamp`

---

## 3. Reasoning Trace Rules
- Must be short, factual, and non-speculative
- No chain-of-thought
- Example:
  - "Sender is client domain"
  - "Mentions active case name"
  - "Contains deadline language"

---

## 4. Determinism Requirement
Given identical inputs and version, the classifier MUST produce identical outputs.

---

## 5. Prohibited Behaviors
- No side effects
- No writes to Gmail
- No filesystem movement
- No automatic escalation or execution
