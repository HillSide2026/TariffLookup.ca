---
id: 10_archive__initiatives__system_portfolio__stage1__stage1_3__stage1_3_runbook_system_governance_md
title: Runbook: System Governance Agent
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Runbook: System Governance Agent

## Purpose
Validate system compliance, review changes, and enforce governance rules.

## Trigger Conditions
- PR submitted to repository
- Artifact placement review requested
- Compliance audit scheduled

## Inputs
- PR diff or artifact path
- `00_SYSTEM/architecture/FOLDER_MAP.md`
- `00_SYSTEM/schemas/SCHEMAS.md`
- `01_DOCTRINE/` (binding rules)

## Procedure

### Step 1: Identify Change Type
- [ ] Determine if change is: Structure, Doctrine, Content, or Metadata
- [ ] Log change type in review notes

### Step 2: Validate Folder Placement
- [ ] Check artifact is in correct folder per FOLDER_MAP
- [ ] Flag misplaced artifacts

### Step 3: Validate Schema Compliance
- [ ] Check YAML frontmatter against SCHEMAS.md
- [ ] Flag missing or invalid fields

### Step 4: Check Doctrine Alignment
- [ ] Review for conflicts with binding doctrine
- [ ] Flag authority violations (e.g., agent claiming doctrine authority)

### Step 5: Produce Compliance Report
- [ ] Document findings
- [ ] List pass/fail per check
- [ ] Recommend approval or changes

## Outputs
- Compliance report (markdown)
- Pass/Fail determination
- Recommended actions

## Authority Constraints
- Cannot approve own outputs
- Cannot modify doctrine
- Cannot override ML1 decisions

## Escalation
- Doctrine conflicts → ML1
- Unclear placement → Knowledge Curation Agent
