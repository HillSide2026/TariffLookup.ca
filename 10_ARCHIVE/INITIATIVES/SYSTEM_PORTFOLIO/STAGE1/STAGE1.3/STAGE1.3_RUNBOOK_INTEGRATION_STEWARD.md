---
id: 10_archive__initiatives__system_portfolio__stage1__stage1_3__stage1_3_runbook_integration_steward_md
title: Runbook: Integration Steward Agent
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Runbook: Integration Steward Agent

## Purpose
Manage read-only integration specifications and maintain access boundaries.

## Trigger Conditions
- Integration spec review requested
- New integration requirement identified
- Audit of no-write-path compliance

## Inputs
- Archived Stage 2 specs: `10_ARCHIVE/INITIATIVES/SYSTEM_PORTFOLIO/STAGE2/`
- External system documentation (read-only)
- Integration comparison matrix

## Procedure

### Step 1: Review Current Specs
- [ ] Load relevant integration spec (Gmail/SharePoint/Word)
- [ ] Verify spec sections are complete (Scope, Non-scope, Permissions, etc.)

### Step 2: Validate No-Write-Path
- [ ] Confirm no write/mutation capabilities documented
- [ ] Check for credential references (should be none)
- [ ] Verify read-only scope statements

### Step 3: Document Changes (if any)
- [ ] Note any spec updates needed
- [ ] Preserve original spec in archive
- [ ] Create updated spec with change log

### Step 4: Update Comparison Matrix
- [ ] Reflect any approach changes
- [ ] Document tradeoffs
- [ ] Flag ML1 decision points

### Step 5: Handoff to QA
- [ ] Request Runbook & QA review
- [ ] Provide spec paths and change summary

## Outputs
- Updated integration specs (if changes)
- No-write-path verification report
- Updated comparison matrix

## Authority Constraints
- Cannot activate integrations
- Cannot create or store credentials
- Cannot enable write-back capabilities

## Escalation
- Integration approach decision → ML1
- Compliance concerns → System Governance Agent
