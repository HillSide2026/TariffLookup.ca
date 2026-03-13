# Dependencies

Project ID: MHS-2D-MICRO-SAAS-001
Project Path: 04_INITIATIVES/HillSide_PORTFOLIO/MATTHEW_HOLDINGS_17513721_CANADA_INC/2D_MICRO_SAAS_BUILD_AND_SALE
Stage: Planning

## Decision Use
Use this file to confirm required dependencies are available before committing milestone dates and gate recommendations.

## Governance Dependencies
- `../PROJECT_CHARTER.md`
- `../PROBLEM_STATEMENT.md`
- `../SUCCESS_CRITERIA.md`
- `../STAKEHOLDERS.md`
- `../RISK_SCAN.md`
- `../APPROVAL_RECORD.md`
- `../../1_POTENTIAL_BUSINESS_INITIATIVES/INITIATIVE_PIPELINE.md` (initiative activation source: `PBI-004`)

## Product / Delivery Dependencies
- Product repository setup and access control
- Frontend/backend application scaffold for MVP
- Hosting/runtime environment
- Analytics instrumentation and dashboard tooling
- Issue-tracking process and support queue

## Data and Logic Dependencies
- Tariff schedules by HS code for United States, European Union, United Kingdom, Japan, Brazil, and China
- Preferential tariff schedules for relevant trade agreements by jurisdiction
- Agreement eligibility rule definitions required to generate notes/conditions
- HS code normalization and validation rules
- Product-description-to-HS-code classification rules or model behavior with confidence/rationale output
- Defined tariff-data refresh process with source timestamp tracking

## Launch / Adoption Dependencies
- Pilot-user onboarding path for Canadian exporters and/or trade consultants
- Initial launch checklist and release criteria
- Feedback capture loop for first 30 days
- Issue triage and incident response workflow

## Operational Dependencies
- Weekly project review cadence with ML1
- Reliable metric data capture from launch onward
- Single source of truth for project artifacts in this folder

## Dependency Risks
- Gaps or delays in tariff/agreement data availability can block MVP launch.
- Ambiguous agreement eligibility rules can degrade result quality.
- Weak pilot-user access can delay validation evidence.
- Missing launch-readiness artifacts can delay go-live.
