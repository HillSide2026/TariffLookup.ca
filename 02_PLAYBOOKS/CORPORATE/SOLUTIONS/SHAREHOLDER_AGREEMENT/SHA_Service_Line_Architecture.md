---
id: 02_playbooks__corporate__solutions__shareholder_agreement__sha_service_line_architecture_md
title: Shareholder Agreement Service Line Architecture
owner: ML1
status: draft
created_date: 2026-02-24
last_updated: 2026-02-24
tags: []
---

# Shareholder Agreement Service Line Architecture

| Field | Value |
|---|---|
| Document Type | System Architecture and Build Specification |
| Jurisdiction | Canadian Corporate Law |
| Scope | Enterprise-Grade Governance Infrastructure |
| Organization | Levine Law Professional Corporation |
| Confidentiality | Confidential |
| Document Date | February 2026 |

---

## Contents

| Section | Module |
|---|---|
| High-Level System Architecture | [SHA_SERVICE_LINE_ARCHITECTURE/01_HIGH_LEVEL_SYSTEM_ARCHITECTURE.md](SHA_SERVICE_LINE_ARCHITECTURE/01_HIGH_LEVEL_SYSTEM_ARCHITECTURE.md) |
| Phased Build Roadmap | [SHA_SERVICE_LINE_ARCHITECTURE/02_PHASED_BUILD_ROADMAP.md](SHA_SERVICE_LINE_ARCHITECTURE/02_PHASED_BUILD_ROADMAP.md) |
| Scenario-Based Drafting Logic Model | [SHA_SERVICE_LINE_ARCHITECTURE/03_SCENARIO_BASED_DRAFTING_LOGIC_MODEL.md](SHA_SERVICE_LINE_ARCHITECTURE/03_SCENARIO_BASED_DRAFTING_LOGIC_MODEL.md) |
| Required Artifacts | [SHA_SERVICE_LINE_ARCHITECTURE/04_REQUIRED_ARTIFACTS.md](SHA_SERVICE_LINE_ARCHITECTURE/04_REQUIRED_ARTIFACTS.md) |
| Gap Analysis: Typical Canadian Law Firm Practice | [SHA_SERVICE_LINE_ARCHITECTURE/05_GAP_ANALYSIS.md](SHA_SERVICE_LINE_ARCHITECTURE/05_GAP_ANALYSIS.md) |
| Tiered Service Model | [SHA_SERVICE_LINE_ARCHITECTURE/06_TIERED_SERVICE_MODEL.md](SHA_SERVICE_LINE_ARCHITECTURE/06_TIERED_SERVICE_MODEL.md) |
| Dashboard and Governance Tracking Model | [SHA_SERVICE_LINE_ARCHITECTURE/07_DASHBOARD_GOVERNANCE_TRACKING_MODEL.md](SHA_SERVICE_LINE_ARCHITECTURE/07_DASHBOARD_GOVERNANCE_TRACKING_MODEL.md) |

---

## High-Level System Architecture

The Shareholder Agreement (SHA) Service Line is a structured, modular system for producing, managing, and maintaining Canadian shareholder governance instruments across all client types. The architecture is organized into five integrated layers: Intake & Diagnostic, Drafting Engine, Execution & Corporate Records, Ongoing Governance Management, and Quality Assurance & Risk Control.

### Architecture Overview
The system operates as an end-to-end governance pipeline. Each layer feeds the next, and all layers maintain audit continuity. No matter enters drafting without completing intake. No matter closes without completing execution and records integration.

|LAYER|COMPONENT|FUNCTION|
|---|---|---|
|Layer 1|Intake & Diagnostic Engine|Client questionnaire, cap table intake, articles review, conflict detection, scenario classification (Scenarios A–D).|
|Layer 2|Drafting Engine|Scenario-triggered clause assembly, modular clause bank, tiered complexity routing (Founders / Private Co / Investor-Ready), risk flags, drafting workflow.|
|Layer 3|Execution & Records Integration|Signature protocol, share certificate endorsement (USA), minute book update, securities register update, SEDI/regulatory compliance check.|
|Layer 4|Ongoing Governance Management|Trigger-based review system, amendment workflow, accession tracking, new shareholder onboarding, event-based escalation (financing, death, dispute).|
|Layer 5|Quality Assurance & Dashboard|Pre-execution audit, version control, dashboard tracker, portfolio-level governance risk indicator, escalation flag management.|

### Governing Legal Framework Integration
Every layer of the architecture is governed by Canadian statutory authority. The system differentiates between federal and provincial corporations at intake and applies statutory logic throughout drafting and execution.

|AUTHORITY|KEY IMPLICATIONS|SYSTEM APPLICATION|
|---|---|---|
|Canada Business Corporations Act (CBCA)|Federal incorporation; CBCA s. 140–146 governs USAs; shareholder rights ss. 190, 241|Triggers federal pathway at intake; USA validity logic; oppression remedy flag|
|Business Corporations Act (Ontario) (OBCA)|Provincial incorporation; s. 108 governs USAs; oppression remedy s. 248|Triggers provincial pathway; Ontario-specific USA mechanics; OBCA compliance checks|
|Director residency requirements (CBCA s. 105)|25% Canadian resident directors required federally|Intake flag; governance allocation matrix accounts for residency constraints|
|Securities law (NI 45-106 private issuer exemption)|Transfer restrictions required for private issuer status; 50-shareholder limit|Transfer restriction module mandatory for private issuer entities; NI 45-106 flag on cap table|
|Oppression remedy (CBCA s. 241; OBCA s. 248)|Minority shareholder protection; reasonable expectations doctrine|Minority protection matrix; shotgun/drag/tag clause logic; escalation triggers|

### Four Core Scenarios
The system processes all engagements through one of four structural scenarios. Scenario classification occurs at intake and determines the drafting pathway, clause bank selection, and risk flags activated.

|SCN|SCENARIO|KEY TRIGGERS|SYSTEM PATHWAY|
|---|---|---|---|
|A|Incorporated – Share Classes Established|Articles filed; cap table established; retrofitting governance|Cap table diagnostic → articles review → conflict detection → harmonization → SHA drafting|
|B|Not Yet Incorporated|Founders negotiating pre-formation; share structure TBD; tax planning potential|Pre-incorporation workflow → share class design → founder allocation → articles integration|
|C|Simple SHA – No Director Power Transfer|Closely held; standard restrictions; no governance reallocation|Basic governance template → modular clause assembly → execution protocol|
|D|Unanimous Shareholder Agreement (USA)|Director power transfer to shareholders; enhanced control; statutory compliance required|USA validity checklist → power reallocation matrix → liability analysis → endorsement protocol|

### Clause Bank Architecture
All templates are assembled from a modular clause bank. Clauses are categorized as Core (present in all agreements), Optional (scenario-dependent), and Investor-Grade (for financing or institutional participation contexts).

|CATEGORY|CLAUSE CODES|EXAMPLES|
|---|---|---|
|CORE|SHA-C-001 to SHA-C-020|Definitions, parties, share ownership acknowledgment, transfer restrictions (private issuer), right of first refusal, spousal consent, confidentiality, dispute resolution, governing law, amendment procedure|
|OPTIONAL|SHA-O-021 to SHA-O-060|Shotgun/buy-sell, drag-along, tag-along, vesting schedules, dividend policy, non-compete, non-solicitation, deadlock procedure, co-sale rights, board composition, quorum requirements, reserved matters|
|INVESTOR-GRADE|SHA-I-061 to SHA-I-100|Anti-dilution, liquidation preferences, protective provisions, information rights, registration rights, board observer rights, conversion rights, pre-emptive rights, redemption rights, investor consent thresholds|
|USA-SPECIFIC|USA-S-101 to USA-S-120|Director power reallocation provisions, director indemnity modification, statutory validity language, share certificate legend requirement, third-party reliance notice, USA amendment mechanics|

### Integration Points
The SHA Service Line integrates with three adjacent systems:
1. Corporate Maintenance Service Line: minute book updates, securities register amendments, and officer/director record changes flow directly from executed SHAs and USAs.
1. Cap Table Management System: the cap table intake structure feeds SHA drafting and is updated upon execution. All post-closing share transfers are reconciled against the SHA transfer restriction module.
1. Matter Dashboard & Ledger: every SHA engagement creates a dashboard record tracking agreement type, execution status, accession completeness, and amendment history. This record persists at the entity level across the portfolio.


## Phased Build Roadmap

The service line is built in five phases over an estimated twelve-week initial deployment window. Each phase has defined outputs, dependencies, and acceptance criteria. No phase begins without prior phase acceptance.

### Phase 1: Foundation (Weeks 1-2)
Objective: Establish the statutory framework, intake logic, and scenario classification system.

|DELIVERABLE|OWNER|ACCEPTANCE CRITERIA|
|---|---|---|
|Governing law checklist (CBCA / OBCA matrix)|Associate|All statutory distinctions mapped; reviewed by supervising lawyer|
|Client intake questionnaire (diagnostic logic)|Associate|Covers all Scenario A–D triggers; tested on 5 hypothetical matters|
|Cap table intake template|Clerk / Associate|Captures share class, authorized/issued, holders, restrictions, options|
|Scenario classification decision tree|Associate|Routes all intake responses to one of four scenarios with no ambiguous paths|
|Articles review checklist|Associate|Covers share class rights, restrictions, amendment procedures, USA notice requirements|

### Phase 2: Core Clause Bank and Templates (Weeks 3-5)
Objective: Build the modular clause bank and produce the Simple SHA and USA templates.

|DELIVERABLE|OWNER|ACCEPTANCE CRITERIA|
|---|---|---|
|Core clause bank (SHA-C-001 to SHA-C-020)|Associate|All clauses coded, tagged, and reviewed for CBCA/OBCA compliance|
|Optional clause bank (SHA-O-021 to SHA-O-060)|Associate|All modules independently operable; no cross-dependencies without flags|
|Simple SHA template (Scenario C)|Associate + Partner review|Assembles from clause bank; covers all standard restrictions; passes QA checklist|
|USA template (Scenario D)|Associate + Partner review|CBCA s.146 / OBCA s.108 compliant; power reallocation matrix embedded; endorsement protocol|
|Founder pre-incorporation term sheet|Associate|Share class design logic; vesting framework; tax flag triggers|
|Deadlock clause variants (3 variants)|Associate|Covered: escalation, appointed third party, put/call mechanism|
|Shotgun / buy-sell clause variants (3 variants)|Associate|Covered: standard shotgun, modified shotgun, sealed-bid procedure|

### Phase 3: Operational Workflows (Weeks 6-7)
Objective: Document the complete operational workflow from intake through post-execution records integration.

|DELIVERABLE|OWNER|ACCEPTANCE CRITERIA|
|---|---|---|
|Drafting workflow (modular assembly protocol)|Associate|Step-by-step; scenario-branching; delegation-ready|
|Conflict detection protocol (articles vs SHA)|Associate|Identifies 10 known conflict types; escalation trigger defined for each|
|Execution protocol (signatures, endorsements, notice)|Clerk + Associate|Covers simple SHA and USA; includes USA share certificate legend protocol|
|Minute book & securities register update protocol|Clerk|Integration checklist with Corporate Maintenance service line|
|Amendment and restatement workflow|Associate|Covers partial amendments, full restatements, and accession agreements|
|Trigger-based review calendar system|Associate|Defined triggers: new shareholder, financing, death, divorce, dispute, USA amendment|

### Phase 4: Resource Library Completion and Investor-Grade Expansion (Weeks 8-10)
Objective: Complete the full resource library; build investor-grade clause bank and templates.

|DELIVERABLE|OWNER|ACCEPTANCE CRITERIA|
|---|---|---|
|Investor-grade clause bank (SHA-I-061 to SHA-I-100)|Associate + Partner|SAFE, convertible note, and priced round variants; NI 45-106 compliance|
|Vesting templates (3 variants)|Associate|Time-based, milestone-based, hybrid; acceleration provisions|
|Cap table template with control logic|Clerk + Associate|Tracks authorized/issued/outstanding; diluted cap table; control thresholds|
|Governance allocation matrix|Associate|Board vs. shareholder vs. unanimous consent thresholds for 25+ decision types|
|Shareholder rights matrix|Associate|Maps rights by share class: voting, dividends, liquidation, conversion, pre-emption|
|All ancillary forms (accession, transfer approval, amendment, buyout worksheet)|Clerk + Associate|Cross-referenced to clause bank; clause codes on all forms|

### Phase 5: Dashboard, QA, and Sales Layer (Weeks 11-12)
Objective: Deploy the dashboard and oversight system, finalize QA mechanisms, and produce client-facing positioning materials.

|DELIVERABLE|OWNER|ACCEPTANCE CRITERIA|
|---|---|---|
|SHA Status Tracker (per entity)|Clerk + Associate|Fields: agreement type, execution status, accession tracker, amendment log, governance flags|
|Portfolio-level governance risk dashboard|Associate|Rolls up entity-level flags; actionable view across all managed entities|
|Pre-execution audit checklist|Associate|30-point checklist; pass/fail gating before execution authorization|
|Client-facing service descriptions (per tier)|Partner|Founders / Private Co / Investor-Ready; scope guardrails defined|
|Pricing model and amendment fee schedule|Partner|Published internally; incorporated into engagement letter templates|
|Internal training materials (annotated templates, worked scenarios)|Associate|2 worked scenarios per tier; annotated clause bank; 45-min training module|


## Scenario-Based Drafting Logic Model

Each scenario is governed by a defined drafting logic sequence. Drafters follow the sequence precisely. Deviation requires supervisor authorization documented in the matter file.

### Scenario A: Company Already Incorporated - Share Classes Established
|USE CASE|Articles filed; share classes defined; cap table established; client wishes to introduce or retrofit shareholder governance.|
|---|---|

Drafting Logic Sequence:
1. Step 1 – Cap Table Diagnostic: Obtain and verify the current cap table. Confirm authorized, issued, and outstanding shares by class. Identify any options, warrants, or convertible instruments. Flag any discrepancies.
1. Step 2 – Articles Review: Review Articles of Incorporation and any amendments. Extract share class rights, restrictions, and conditions. Confirm any existing restrictions on transfer. Identify any USA notation on share certificates.
1. Step 3 – Conflict Detection: Compare proposed SHA provisions against Articles. Flag conflicts in: transfer restriction mechanics, voting thresholds, share class rights, quorum requirements, and amendment procedures.
1. Step 4 – Harmonization Decision: Where conflicts exist, determine whether to (a) draft SHA to be subordinate to Articles, (b) recommend Articles amendment before SHA execution, or (c) escalate to supervising lawyer for structural advice.
1. Step 5 – Clause Assembly: Assemble SHA from clause bank using Scenario A protocol. Core clauses + Scenario A optional clauses. Flag investor-grade upgrade if any shareholder holds preferred shares or convertible instruments.
1. Step 6 – Risk Flags Review: Run Scenario A risk flag checklist. Escalation triggers: conflict with Articles; minority shareholder holding below 10%; USA execution when director powers not expressly transferred; pre-emptive rights absent when share classes present.
1. Step 7 – QA & Execution: Pre-execution audit. Execution protocol. Minute book and securities register update.

### Scenario B: Company Not Yet Incorporated
|USE CASE|Founders negotiating governance before corporate formation. Share structure not yet designed. Tax planning may be implicated. Articles not yet filed.|
|---|---|

Drafting Logic Sequence:
1. Step 1 – Pre-Incorporation Structuring Workflow: Complete pre-incorporation questionnaire. Identify: number of founders, proposed ownership split, vesting requirements, planned financings, jurisdiction (federal vs provincial), and tax objectives.
1. Step 2 – Share Class Design: Apply share class design decision tree. Standard founder structure: multiple voting common + restricted voting common (or single class for simple structures). Preferred share class for investor participation if anticipated within 24 months.
1. Step 3 – Tax Coordination Flag: Screen for: estate freeze considerations, lifetime capital gains exemption eligibility (small business corporation test), spousal or family trust participation, section 85 rollover potential. If any flag triggered: escalate to tax counsel before articles filed.
1. Step 4 – Founder Allocation Model: Document proposed equity split. Apply vesting logic: minimum 4-year vesting with 1-year cliff standard. Confirm good leaver / bad leaver definitions. Confirm founder buy-back pricing mechanism.
1. Step 5 – Draft Term Sheet + SHA: Produce founder pre-incorporation term sheet. Upon founder agreement, draft SHA and coordinate with articles (ensure share class rights in articles match SHA provisions).
1. Step 6 – Articles Integration Checklist: Confirm SHA provisions are consistent with proposed articles before filing. Articles filed after SHA finalized (subject to any pre-incorporation agreement mechanics).
1. Step 7 – Execution & Records: Execution following incorporation. Update minute book on day-one.

### Scenario C: Simple Shareholder Agreement - No Director Power Transfer
|USE CASE|Closely held company. Standard restrictions and protections. No transfer of director powers to shareholders. Contractual governance only.|
|---|---|

Drafting Logic Sequence:
1. Step 1 – Confirm Scenario: Confirm that no transfer of director powers is contemplated. Confirm all shareholders are parties. Confirm corporate jurisdiction.
1. Step 2 – Core Clause Assembly: Assemble all Core clauses (SHA-C-001 to SHA-C-020) as the contractual backbone.
1. Step 3 – Optional Module Selection: Present optional module selection matrix to supervising lawyer. Standard Scenario C modules: transfer restrictions (ROFR), shotgun clause, drag-along, tag-along, dividend policy, deadlock, dispute resolution. Non-compete and non-solicitation where applicable to shareholder-employees.
1. Step 4 – Governance Allocation Confirmation: Confirm all governance provisions are contractual only. Board retains all statutory powers. SHA governs contractual obligations between shareholders. Note: SHA cannot override director fiduciary duties.
1. Step 5 – Private Issuer Compliance: Confirm transfer restriction language satisfies NI 45-106 private issuer exemption requirements. Confirm 50-shareholder limit is not breached post-closing.
1. Step 6 – QA & Execution: Pre-execution audit checklist. All shareholders sign. Spousal consents where required. Minute book note.

### Scenario D: Unanimous Shareholder Agreement (USA)
|USE CASE|Shareholders agree to transfer some or all director powers to shareholders. Statutory recognition under CBCA s. 146 or OBCA s. 108 required. Enhanced governance control. Director liability implications.|
|---|---|

Drafting Logic Sequence:
1. Step 1 – USA Validity Checklist: Confirm all issued shareholders are parties. Confirm the agreement purports to restrict director powers expressly. Confirm jurisdiction (CBCA or OBCA) and applicable USA recognition provisions.
1. Step 2 – Director Power Reallocation Matrix: Identify which director powers are being transferred to shareholders. Map each transferred power using the governance allocation matrix. Confirm transferred powers are within statutory permissibility (cannot transfer all director powers in a manner inconsistent with corporate law).
1. Step 3 – Liability Reallocation Analysis: Under CBCA s. 146(5) and OBCA s. 108(5), shareholders who hold USA powers assume director liabilities to the extent of those powers. Analyze: employment liability, environmental liability, wage obligations, tax remittances. Produce liability reallocation memo. Flag to client. Insurance review flag if liability significant.
1. Step 4 – Director Indemnity Review: Assess whether director indemnity provisions in the articles or existing governance documents require modification given power reallocation. Produce recommendation.
1. Step 5 – Clause Assembly: Core clauses + USA-specific clauses (USA-S-101 to USA-S-120) + applicable optional modules. Note distinction between contractual SHA provisions and statutory USA mechanics.
1. Step 6 – Share Certificate Endorsement Protocol: Prepare share certificate legend. Under CBCA s. 49(8) and OBCA s. 56(3), notice of USA must appear on share certificates or be provided to holders. Prepare endorsement/legend text for all outstanding share certificates. Flag for re-issuance or endorsement at execution.
1. Step 7 – Third-Party Reliance Notice: Assess whether any third parties (lenders, landlords, material counterparties) need to be notified of the USA and its governance implications. Prepare notice protocol if applicable.
1. Step 8 – QA, Execution & Records: USA-specific pre-execution audit. Execution by all shareholders. Share certificate endorsement. Minute book update. Update corporate records to reflect USA status.

### Cross-Scenario Decision Tree: Agreement Type Selection
The following logic governs agreement type selection at intake. This is the threshold determination before any drafting begins.

|INTAKE QUESTION|ROUTING OUTCOME|
|---|---|
|Is the corporation incorporated?|YES → Scenario A or C/D. NO → Scenario B.|
|Do shareholders wish to transfer any director powers to shareholders?|YES → Scenario D (USA required). NO → Scenario C or A.|
|Are articles already filed with share classes defined?|YES → Scenario A diagnostic protocol applies. NO → Scenario B or C.|
|Is any investor (non-founder) a party to the agreement?|Investor-grade clause bank triggered. Escalation to senior review required.|
|Does any shareholder hold preferred shares or convertible instruments?|Investor-grade optional modules mandatory. Anti-dilution and liquidation preference clauses required.|
|Are all shareholders parties to the proposed agreement?|NO → Cannot be a USA. Must remain a simple SHA. Flag and confirm scope.|


## Required Artifacts

The following artifacts constitute the complete Resource Library for the SHA Service Line. All artifacts are modular and clause-coded. Version control applies to all items.

### Templates
|#|ARTIFACT|CODE|NOTES|
|---|---|---|---|
|1|Simple Shareholder Agreement – Standard Form|TPL-SHA-001|Core + Scenario C optional modules; single-class and multi-class variants|
|2|Unanimous Shareholder Agreement – Standard Form|TPL-USA-001|CBCA and OBCA variants; power reallocation matrix embedded|
|3|Founder Pre-Incorporation Term Sheet|TPL-TERMS-001|Share class design; vesting; founder allocation; tax flags|
|4|Investor-Grade SHA (Seed / Series A)|TPL-INV-001|Anti-dilution, liquidation preference, protective provisions, information rights|
|5|Accession Agreement|TPL-ACC-001|For new shareholders joining existing SHA or USA|
|6|SHA Amendment Template|TPL-AMD-001|Partial amendment and full restatement variants|
|7|Director Resignation and Appointment Forms|TPL-DIR-001|For use in conjunction with USA governance reallocation|
|8|Share Transfer Approval Form|TPL-TRF-001|Board and shareholder consent; ROFR waiver; private issuer compliance|
|9|Share Certificate Legend (USA Reference)|TPL-LEG-001|CBCA s.49(8) and OBCA s.56(3) compliant legend text|
|10|Risk Disclosure Memo Template|TPL-RDM-001|For USA liability reallocation disclosure to shareholders|

### Matrices and Worksheets
|#|ARTIFACT|CODE|NOTES|
|---|---|---|---|
|11|Governance Allocation Matrix|MTX-GOV-001|25+ decision types; board / majority shareholders / unanimous consent thresholds|
|12|Shareholder Rights Matrix|MTX-RTS-001|Rights by share class: voting, dividends, liquidation, conversion, pre-emption, redemption|
|13|Cap Table Template (with Control Logic)|MTX-CAP-001|Authorized/issued/diluted; voting thresholds; control flags; NI 45-106 counter|
|14|Deadlock Clause Variants Comparison|MTX-DLK-001|3 variants; comparative matrix; scenario guidance|
|15|Shotgun / Buy-Sell Clause Variants Comparison|MTX-SHG-001|3 variants; standard / modified / sealed-bid; minority protection analysis|
|16|Drag-Along / Tag-Along Variants|MTX-DRG-001|Threshold variants; co-sale right structure; price parity mechanics|
|17|Buyout Calculation Worksheet|WRK-BUY-001|Formula-driven; book value / agreed value / appraised value variants|
|18|Valuation Mechanism Checklist|CHK-VAL-001|Trigger events; methodology selection; appraiser appointment protocol|
|19|Vesting Templates (3 variants)|TPL-VST-001|Time-based; milestone-based; hybrid; single/double trigger acceleration|

### Checklists and Protocols
|#|ARTIFACT|CODE|NOTES|
|---|---|---|---|
|20|Client Intake Questionnaire|CHK-INT-001|Diagnostic logic; scenario routing; escalation flags|
|21|Articles Review Checklist|CHK-ART-001|Share class rights, restrictions, USA notation, amendment provisions|
|22|Conflict Detection Protocol|CHK-CON-001|10 known conflict types; articles vs SHA comparison matrix; escalation triggers|
|23|USA Validity Checklist|CHK-USA-001|All-shareholder parties test; power reallocation express language; jurisdiction compliance|
|24|Pre-Execution Audit Checklist (30-point)|CHK-PRE-001|Pass/fail gate before execution authorization; senior review sign-off required|
|25|Execution Checklist (Simple SHA)|CHK-EXE-001|Signature pages; capacity confirmation; spousal consents; dating protocol|
|26|Execution Checklist (USA)|CHK-EXE-002|All items in CHK-EXE-001 plus: share certificate legend; director notification; third-party notice|
|27|Post-Execution Integration Checklist|CHK-POST-001|Minute book; securities register; dashboard update; accession tracking initiation|
|28|Minute Book Update Protocol|CHK-MB-001|Integration with Corporate Maintenance service line; SHA and USA filing requirements|


## Gap Analysis: Typical Canadian Law Firm Practice

The following analysis identifies structural, operational, and quality gaps common in typical Canadian law firm shareholder agreement practice relative to the enterprise standard this service line is designed to achieve.

|GAP AREA|TYPICAL FIRM PRACTICE|THIS SERVICE LINE STANDARD|
|---|---|---|
|Intake & Diagnostic|Unstructured intake; verbal instructions; no formal diagnostic tool|Structured diagnostic questionnaire; scenario classification; cap table intake; articles review before drafting begins|
|Conflict Detection (Articles vs SHA)|Ad hoc comparison; relies on drafter memory; frequently missed in high-volume matters|Mandatory conflict detection protocol (CHK-CON-001); 10 known conflict types; escalation triggers; documented resolution|
|USA / Simple SHA Distinction|Often drafted as simple SHA; USA mechanics added without statutory compliance analysis; share certificate endorsement missed|Threshold determination at intake; USA validity checklist; share certificate legend protocol mandatory; liability reallocation analysis required|
|Director Liability Reallocation (USA)|Rarely disclosed to shareholders; liability analysis absent; no insurance review flag|Liability reallocation memo mandatory for all USAs; insurance review flag; client disclosure protocol|
|Modular Clause Architecture|Template-based drafting with direct edits to full templates; version drift accumulates; no clause coding|Fully modular clause bank; clause codes on all provisions; assembly protocol prevents unauthorized edits to base clauses; version control system|
|Pre-Incorporation Structuring|Often skipped or handled informally; share class design not documented; tax flags not raised systematically|Formal pre-incorporation workflow; share class design decision tree; tax coordination flag triggers; articles integration checklist|
|Cap Table Integration|Cap table not reviewed at SHA drafting; SHA transfer restrictions not reconciled with cap table; NI 45-106 private issuer limit not monitored|Cap table intake mandatory; control logic built into cap table template; NI 45-106 counter; SHA reconciled with cap table at drafting and execution|
|Minority Shareholder Protection|Minority protections ad hoc; oppression remedy considerations not systematically applied; no minority protection matrix|Minority protection matrix; oppression remedy flag at intake; drag/tag provisions systematically reviewed; shotgun clause asymmetry analysis|
|Post-Execution Records Integration|Minute book updates often delayed or incomplete; securities register not consistently updated; USA endorsement frequently missed|Post-execution integration checklist mandatory; immediate minute book and securities register updates; USA endorsement protocol on day-of-execution|
|Ongoing Governance Monitoring|SHA treated as one-off document; no trigger-based review; accession tracking absent; amendment history not maintained|Trigger-based review calendar; accession tracking per entity; amendment log maintained on dashboard; portfolio-level governance risk view|
|Federal / Provincial Differentiation|Often uses single template for CBCA and OBCA corporations without statutory differentiation|Jurisdiction determination at intake; CBCA and OBCA variants for all statutory provisions; USA validity checklist jurisdiction-specific|
|Investor-Grade Provisions|Investor rights added ad hoc without structured clause bank; anti-dilution mechanics inconsistent; SAFE/convertible note reconciliation absent|Dedicated investor-grade clause bank (SHA-I-061 to SHA-I-100); structured upgrade path; SAFE and convertible note reconciliation protocol|
|Quality Assurance|Informal review process; no standardized pre-execution checklist; QA dependent on individual drafter diligence|30-point pre-execution audit checklist; pass/fail gate; senior review required before execution authorization; QA documented in matter file|
|Training & Knowledge Transfer|Apprenticeship model; knowledge held by senior lawyers; no structured training materials; delegation to junior staff risky|Annotated templates; worked scenarios per tier; training module; delegation protocols; system designed for associate/clerk execution under supervision|

### Critical Risk Gaps: Immediate Priority
The following gaps represent the highest legal risk in typical practice and must be addressed as Phase 1 and Phase 2 priorities:
1. USA endorsement on share certificates: frequently missed; creates validity and third-party notice risk under CBCA s. 49(8) and OBCA s. 56(3).
1. Director liability reallocation disclosure: absent in most practice; creates professional liability exposure when shareholders incur liabilities they were not advised of.
1. Articles conflict detection: SHA provisions inconsistent with Articles are unenforceable in key respects; conflict detection must be mandatory before execution.
1. NI 45-106 private issuer compliance: SHA transfer restrictions must be sufficient to maintain private issuer status; failure creates securities law exposure.
1. All-shareholder parties requirement for USAs: a USA signed by fewer than all shareholders is not a valid USA; frequently misunderstood in practice.


## Tiered Service Model

The service line is structured into three tiers corresponding to the complexity and governance maturity of the client. Tier selection occurs at intake based on scenario classification and client profile. Each tier has defined scope, standard deliverables, escalation triggers, and pricing logic.

### Tier 1: Founders Package
|TARGET CLIENT|Early-stage founder-led startups; pre-seed or seed stage; 2–5 founders; typically pre-incorporation or newly incorporated; no institutional investors.|
|---|---|

|COMPONENT|STANDARD SCOPE|
|---|---|
|Scenarios Covered|Scenario B (pre-incorporation) or Scenario C (simple SHA, newly incorporated)|
|Agreement Type|Simple SHA (no USA); option to upgrade to USA at Tier 2 pricing|
|Core Deliverables|Founder SHA (Core + Scenario C/B modules); pre-incorporation term sheet (Scenario B); vesting schedule; founder ROFR; shotgun clause; basic deadlock provision; spousal consents|
|Standard Clauses Included|SHA-C-001 to SHA-C-020 (all Core); SHA-O-021 (ROFR); SHA-O-022 (Shotgun); SHA-O-030 (Vesting); SHA-O-035 (Non-compete); SHA-O-040 (Deadlock – escalation variant); SHA-O-050 (Dispute resolution)|
|Excluded from Tier 1 Scope|Anti-dilution provisions; liquidation preferences; investor protective provisions; board observer rights; SAFE/convertible note reconciliation; securities law structuring advice|
|Escalation Triggers|Any investor (non-founder) as party → Tier 2 or 3 upgrade; preferred shares in structure → Tier 2 upgrade; USA requested → additional USA module fee; tax structuring required → external referral or engagement expansion|
|Pricing Logic|Fixed-fee: Pre-Incorporation Package (includes term sheet + SHA + vesting + cap table template). Post-Incorporation Simple SHA Package (includes SHA + ancillary forms). Pricing published in engagement letter template.|

### Tier 2: Private Company Package
|TARGET CLIENT|Established closely held private corporations; 2–10 shareholders; may include family members or passive investors; potential minority/majority dynamic; no institutional venture investors.|
|---|---|

|COMPONENT|STANDARD SCOPE|
|---|---|
|Scenarios Covered|Scenario A (incorporated, share classes established) or Scenario C; USA available as module add-on|
|Agreement Type|Simple SHA or USA (selected at intake); both variants within Tier 2 scope|
|Core Deliverables|Full SHA or USA; cap table intake and review; articles review and conflict detection; governance allocation matrix; deadlock and buy-sell provisions; drag-along and tag-along; dividend policy; shareholder rights matrix; ancillary forms|
|Standard Clauses Included|All Core clauses; full Optional module selection (SHA-O-021 to SHA-O-060 as applicable); USA-specific clauses for USA engagements|
|Excluded from Tier 2 Scope|Institutional investor provisions; Series A+ investor rights; SAFE/convertible note reconciliation beyond flag and referral; securities law opinion; tax restructuring|
|Escalation Triggers|Institutional investor as party → Tier 3; securities law structuring → external referral; complex USA power reallocation with significant liability exposure → Partner review required; multi-class preferred structure → Tier 3 or engagement expansion|
|Pricing Logic|Fixed-fee ranges: Simple SHA Package (includes articles review + SHA + ancillary forms). USA Package (premium over Simple SHA; includes validity analysis, liability memo, endorsement protocol). Governance Audit add-on available.|

### Tier 3: Investor-Ready Package
|TARGET CLIENT|Growth-stage companies with existing or anticipated institutional investors; Series Seed through Series B; SAFE or convertible note holders; multi-class share structures; investor-negotiated protective provisions.|
|---|---|

|COMPONENT|STANDARD SCOPE|
|---|---|
|Scenarios Covered|Scenario A (with investor participation); investor-grade clause bank mandatory|
|Agreement Type|Investor SHA (simple SHA with investor-grade modules) or USA with investor rights; co-invest structures supported|
|Core Deliverables|Investor SHA; full cap table diagnostic (including diluted cap table, SAFE conversion, option pool); investor rights schedule; anti-dilution analysis; liquidation preference waterfall; protective provisions matrix; board composition provisions; information rights provisions; SAFE/convertible reconciliation; shareholder rights matrix; governance allocation matrix|
|Standard Clauses Included|All Core clauses; investor-grade clause bank (SHA-I-061 to SHA-I-100 as applicable); applicable optional modules; NI 45-106 private issuer compliance confirmation|
|Escalation Triggers|Securities law opinion required → engagement expansion or referral; public company preparation → separate service line; cross-border investor rights (US/foreign) → external counsel coordination; tax restructuring in connection with financing → tax referral|
|Pricing Logic|Time-and-materials or fixed-fee project basis depending on complexity. Minimum engagement scope defined. Partner involvement mandatory. Separate fee for SAFE/convertible note reconciliation. Governance Audit add-on available.|

### Cross-Tier Add-On Services
|ADD-ON SERVICE|ELIGIBLE TIERS|SCOPE|
|---|---|---|
|USA Module (upgrade from Simple SHA)|Tier 1, Tier 2|USA validity analysis + liability memo + endorsement protocol|
|Governance Audit|Tier 1, Tier 2, Tier 3|Review existing SHA/USA against current governance structure; flag conflicts and gaps; amendment recommendations|
|SHA Amendment|All Tiers|Partial amendment or full restatement per amendment workflow|
|Accession Agreement|All Tiers|New shareholder joining existing SHA or USA; cap table update|
|Founder Governance Architecture Package|Tier 1 (primary)|Full Scenario B workflow: term sheet + SHA + cap table + vesting + articles coordination|
|Annual Governance Review|Tier 2, Tier 3|Trigger-based review; accession completeness check; amendment flag; integration with Corporate Maintenance retainer|


## Dashboard and Governance Tracking Model

The Dashboard & Oversight Layer is the single source of truth for shareholder governance architecture across all managed entities. It operates at two levels: the Entity-Level Tracker (per corporation) and the Portfolio-Level Risk Dashboard (across all entities under management).

### Entity-Level SHA Status Tracker
Each managed entity receives a dedicated SHA Status Record. The record is created at engagement intake and maintained throughout the life of the matter and beyond.

|FIELD|DATA TYPE|NOTES|
|---|---|---|
|Entity Name & Jurisdiction|Text|Federal (CBCA) or provincial; provincial jurisdiction noted|
|Agreement Type|Simple SHA / USA / None|Dropdown; updated on execution|
|Agreement Version|Version number + date|Auto-increments on amendment or restatement|
|Execution Status|Draft / Executed / Not in place|Gate field: no execution date without pre-execution audit sign-off|
|Execution Date|Date|Date of last full execution or restatement|
|Parties / Shareholders|List|Names; share class; date joined; accession agreement reference|
|Accession Completeness|Flag: Complete / Gap|Red flag if any current shareholder has not executed or acceded|
|Amendment Log|Date + summary|Chronological; references amendment template version|
|Governance Type Indicator|Board Control / Shareholder Control / Mixed|Derived from governance allocation matrix; updated on USA or amendment|
|Buy-Sell Trigger Monitor|Active / None / Triggered|Flag if shotgun, drag, or put/call mechanism has been activated|
|Cap Table Alignment Flag|Aligned / Misaligned / Unreviewed|Red flag if SHA transfer restrictions do not match current cap table|
|Articles Conflict Flag|No Conflict / Flag / Escalated|Red flag if conflict detected in last articles review; notes escalation outcome|
|USA Share Certificate Status|Endorsed / Pending / N/A|For USA entities only; red flag if endorsement pending more than 14 days post-execution|
|Next Review Trigger Date|Date + trigger type|System-populated based on trigger-based review calendar|
|Matter File Reference|File number|Links to matter management system and version control repository|

### Portfolio-Level Governance Risk Dashboard
The portfolio dashboard aggregates entity-level flags and provides a governance risk view across all managed entities. It is the primary tool for supervising lawyers to identify at-risk matters requiring attention without reviewing individual entity files.

|DASHBOARD INDICATOR|RISK LEVEL|TRIGGER CONDITION|
|---|---|---|
|No SHA/USA in place|HIGH|Entity has more than one shareholder; no executed agreement on file|
|Accession Gap|HIGH|Current shareholder has not executed or acceded to existing SHA/USA|
|Articles Conflict – Unresolved|HIGH|Conflict detected between SHA and Articles; no documented resolution on file|
|USA – Certificate Endorsement Pending|HIGH|USA entity: share certificates not endorsed more than 14 days post-execution|
|Cap Table Misalignment|MEDIUM|Cap table updated (new issuance or transfer) but SHA transfer restrictions not reviewed|
|Buy-Sell Mechanism Triggered|MEDIUM|Shotgun clause, drag, or put/call mechanism activated; no active matter file open|
|SHA Over 3 Years Without Review|MEDIUM|No amendment or governance review in past 36 months|
|New Shareholder – No Accession|MEDIUM|Share issuance or transfer recorded in cap table; no accession agreement on file within 30 days|
|NI 45-106 Counter at 45+|MEDIUM|Shareholder count approaching private issuer limit of 50; review required|
|Financing Trigger Pending|LOW|Client has indicated upcoming financing round; SHA investor-grade review not yet opened|
|Tax Coordination Flag|LOW|Scenario B flag raised at intake; tax referral not documented on file|

### Integration with Corporate Maintenance Service Line
The SHA Dashboard integrates with the Corporate Maintenance Service Line at the following touch points:

|TRIGGER EVENT|SHA SYSTEM ACTION|CORPORATE MAINTENANCE ACTION|
|---|---|---|
|SHA / USA Executed|Dashboard record updated; accession tracking initiated; execution date recorded|Minute book updated; SHA filed in corporate records; USA notation to share register|
|New Shareholder Admitted|Accession gap flag triggered; accession agreement workflow opened|Securities register updated; share certificate issued; transfer approval form filed|
|SHA Amended or Restated|Amendment log updated; version incremented; conflict detection re-run|Minute book updated; prior SHA version superseded; share certificate endorsements re-reviewed if USA|
|Director Change|Governance type indicator reviewed; USA power reallocation matrix re-reviewed if director removed|Director consent filed; CBCA/OBCA director change filed with registry if applicable|
|Shareholder Death or Incapacity|Buy-sell trigger monitor activated; SHA deadlock and buy-out provisions flagged; estate-hold period review|Securities register notation; estate transfer protocol initiated; share certificates reviewed|
|Financing / New Investor|Tier upgrade flag; investor-grade clause bank review triggered; NI 45-106 counter updated|Articles review for new share class; RESA / subscription agreements filed; cap table updated|

### Version Control Standards
1. All templates and clauses maintain version numbers in the format [CODE]-v[X.X] (e.g., TPL-SHA-001-v1.2).
1. Minor amendments (typographical, formatting): increment sub-version (v1.1 → v1.2).
1. Substantive changes to legal content or structure: increment major version (v1.2 → v2.0). Partner sign-off required.
1. Superseded versions retained in version control repository; never deleted.
1. All client-executed agreements are linked to the template version from which they were assembled.
1. Annual template review: all templates reviewed for legislative or jurisprudential changes requiring update.

### Escalation and Approval Matrix
|MATTER TYPE / DECISION|APPROVAL LEVEL|NOTES|
|---|---|---|
|Tier 1 Simple SHA – Standard Matter|Associate (supervised)|Pre-execution audit sign-off by Associate|
|Tier 2 Simple SHA – Standard Matter|Associate|Pre-execution audit sign-off by Associate; partner file review|
|USA – Any Tier|Associate + Partner|Liability reallocation memo requires partner review before delivery to client|
|Investor-Grade SHA (Tier 3)|Partner (lead)|Minimum Partner involvement required; investor counsel review coordination|
|Articles Conflict – Escalated Flag|Associate + Partner|Conflict cannot be resolved by drafter alone; structural advice required|
|Tax Coordination Flag Triggered|Partner + Tax Referral|Matter cannot proceed to drafting until tax flag resolved or client declines advice|
|Template Major Version Update (v X.0)|Partner + Associate|Legal content change; statutory compliance re-verification required|
|Portfolio-Level HIGH Risk Flag|Supervising Partner|Direct partner contact with client required within 5 business days of flag|
