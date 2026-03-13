---
id: 02_playbooks__corporate__solutions__shareholder_agreement__sha_service_line_architecture__01_high_level_system_architecture_md
title: High-Level System Architecture
owner: ML1
status: draft
created_date: 2026-02-24
last_updated: 2026-02-24
tags: []
---

# High-Level System Architecture

---


The Shareholder Agreement (SHA) Service Line is a structured, modular system for producing, managing, and maintaining Canadian shareholder governance instruments across all client types. The architecture is organized into five integrated layers: Intake & Diagnostic, Drafting Engine, Execution & Corporate Records, Ongoing Governance Management, and Quality Assurance & Risk Control.

## Architecture Overview
The system operates as an end-to-end governance pipeline. Each layer feeds the next, and all layers maintain audit continuity. No matter enters drafting without completing intake. No matter closes without completing execution and records integration.

|LAYER|COMPONENT|FUNCTION|
|---|---|---|
|Layer 1|Intake & Diagnostic Engine|Client questionnaire, cap table intake, articles review, conflict detection, scenario classification (Scenarios A–D).|
|Layer 2|Drafting Engine|Scenario-triggered clause assembly, modular clause bank, tiered complexity routing (Founders / Private Co / Investor-Ready), risk flags, drafting workflow.|
|Layer 3|Execution & Records Integration|Signature protocol, share certificate endorsement (USA), minute book update, securities register update, SEDI/regulatory compliance check.|
|Layer 4|Ongoing Governance Management|Trigger-based review system, amendment workflow, accession tracking, new shareholder onboarding, event-based escalation (financing, death, dispute).|
|Layer 5|Quality Assurance & Dashboard|Pre-execution audit, version control, dashboard tracker, portfolio-level governance risk indicator, escalation flag management.|

## Governing Legal Framework Integration
Every layer of the architecture is governed by Canadian statutory authority. The system differentiates between federal and provincial corporations at intake and applies statutory logic throughout drafting and execution.

|AUTHORITY|KEY IMPLICATIONS|SYSTEM APPLICATION|
|---|---|---|
|Canada Business Corporations Act (CBCA)|Federal incorporation; CBCA s. 140–146 governs USAs; shareholder rights ss. 190, 241|Triggers federal pathway at intake; USA validity logic; oppression remedy flag|
|Business Corporations Act (Ontario) (OBCA)|Provincial incorporation; s. 108 governs USAs; oppression remedy s. 248|Triggers provincial pathway; Ontario-specific USA mechanics; OBCA compliance checks|
|Director residency requirements (CBCA s. 105)|25% Canadian resident directors required federally|Intake flag; governance allocation matrix accounts for residency constraints|
|Securities law (NI 45-106 private issuer exemption)|Transfer restrictions required for private issuer status; 50-shareholder limit|Transfer restriction module mandatory for private issuer entities; NI 45-106 flag on cap table|
|Oppression remedy (CBCA s. 241; OBCA s. 248)|Minority shareholder protection; reasonable expectations doctrine|Minority protection matrix; shotgun/drag/tag clause logic; escalation triggers|

## Four Core Scenarios
The system processes all engagements through one of four structural scenarios. Scenario classification occurs at intake and determines the drafting pathway, clause bank selection, and risk flags activated.

|SCN|SCENARIO|KEY TRIGGERS|SYSTEM PATHWAY|
|---|---|---|---|
|A|Incorporated – Share Classes Established|Articles filed; cap table established; retrofitting governance|Cap table diagnostic → articles review → conflict detection → harmonization → SHA drafting|
|B|Not Yet Incorporated|Founders negotiating pre-formation; share structure TBD; tax planning potential|Pre-incorporation workflow → share class design → founder allocation → articles integration|
|C|Simple SHA – No Director Power Transfer|Closely held; standard restrictions; no governance reallocation|Basic governance template → modular clause assembly → execution protocol|
|D|Unanimous Shareholder Agreement (USA)|Director power transfer to shareholders; enhanced control; statutory compliance required|USA validity checklist → power reallocation matrix → liability analysis → endorsement protocol|

## Clause Bank Architecture
All templates are assembled from a modular clause bank. Clauses are categorized as Core (present in all agreements), Optional (scenario-dependent), and Investor-Grade (for financing or institutional participation contexts).

|CATEGORY|CLAUSE CODES|EXAMPLES|
|---|---|---|
|CORE|SHA-C-001 to SHA-C-020|Definitions, parties, share ownership acknowledgment, transfer restrictions (private issuer), right of first refusal, spousal consent, confidentiality, dispute resolution, governing law, amendment procedure|
|OPTIONAL|SHA-O-021 to SHA-O-060|Shotgun/buy-sell, drag-along, tag-along, vesting schedules, dividend policy, non-compete, non-solicitation, deadlock procedure, co-sale rights, board composition, quorum requirements, reserved matters|
|INVESTOR-GRADE|SHA-I-061 to SHA-I-100|Anti-dilution, liquidation preferences, protective provisions, information rights, registration rights, board observer rights, conversion rights, pre-emptive rights, redemption rights, investor consent thresholds|
|USA-SPECIFIC|USA-S-101 to USA-S-120|Director power reallocation provisions, director indemnity modification, statutory validity language, share certificate legend requirement, third-party reliance notice, USA amendment mechanics|

## Integration Points
The SHA Service Line integrates with three adjacent systems:
1. Corporate Maintenance Service Line: minute book updates, securities register amendments, and officer/director record changes flow directly from executed SHAs and USAs.
1. Cap Table Management System: the cap table intake structure feeds SHA drafting and is updated upon execution. All post-closing share transfers are reconciled against the SHA transfer restriction module.
1. Matter Dashboard & Ledger: every SHA engagement creates a dashboard record tracking agreement type, execution status, accession completeness, and amendment history. This record persists at the entity level across the portfolio.
