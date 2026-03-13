---
id: 02_playbooks__corporate__solutions__shareholder_agreement__sha_service_line_architecture__07_dashboard_governance_tracking_model_md
title: Dashboard and Governance Tracking Model
owner: ML1
status: draft
created_date: 2026-02-24
last_updated: 2026-02-24
tags: []
---

# Dashboard and Governance Tracking Model

---


The Dashboard & Oversight Layer is the single source of truth for shareholder governance architecture across all managed entities. It operates at two levels: the Entity-Level Tracker (per corporation) and the Portfolio-Level Risk Dashboard (across all entities under management).

## Entity-Level SHA Status Tracker
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

## Portfolio-Level Governance Risk Dashboard
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

## Integration with Corporate Maintenance Service Line
The SHA Dashboard integrates with the Corporate Maintenance Service Line at the following touch points:

|TRIGGER EVENT|SHA SYSTEM ACTION|CORPORATE MAINTENANCE ACTION|
|---|---|---|
|SHA / USA Executed|Dashboard record updated; accession tracking initiated; execution date recorded|Minute book updated; SHA filed in corporate records; USA notation to share register|
|New Shareholder Admitted|Accession gap flag triggered; accession agreement workflow opened|Securities register updated; share certificate issued; transfer approval form filed|
|SHA Amended or Restated|Amendment log updated; version incremented; conflict detection re-run|Minute book updated; prior SHA version superseded; share certificate endorsements re-reviewed if USA|
|Director Change|Governance type indicator reviewed; USA power reallocation matrix re-reviewed if director removed|Director consent filed; CBCA/OBCA director change filed with registry if applicable|
|Shareholder Death or Incapacity|Buy-sell trigger monitor activated; SHA deadlock and buy-out provisions flagged; estate-hold period review|Securities register notation; estate transfer protocol initiated; share certificates reviewed|
|Financing / New Investor|Tier upgrade flag; investor-grade clause bank review triggered; NI 45-106 counter updated|Articles review for new share class; RESA / subscription agreements filed; cap table updated|

## Version Control Standards
1. All templates and clauses maintain version numbers in the format [CODE]-v[X.X] (e.g., TPL-SHA-001-v1.2).
1. Minor amendments (typographical, formatting): increment sub-version (v1.1 → v1.2).
1. Substantive changes to legal content or structure: increment major version (v1.2 → v2.0). Partner sign-off required.
1. Superseded versions retained in version control repository; never deleted.
1. All client-executed agreements are linked to the template version from which they were assembled.
1. Annual template review: all templates reviewed for legislative or jurisprudential changes requiring update.

## Escalation and Approval Matrix
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
