---
id: 10_archive__initiatives__system_portfolio__stage1__stage1_2__stage2_integration_comparison_matrix_md
title: Stage 2 Cross-Integration Comparison Matrix
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Stage 2 Cross-Integration Comparison Matrix

## Systems Compared
- Gmail
- SharePoint
- Microsoft Word

## Approaches Evaluated
- API
- Connector
- Export

## Comparison Dimensions
- Read-only scope fidelity
- Audit/logging support
- Permission complexity
- Rate limits / throttling
- Administrative overhead
- Policy/compliance risk

## Summary Table
| System | Approach | Read-Only Scope Fidelity | Audit/Logging Support | Permission Complexity | Rate Limits / Throttling | Administrative Overhead | Policy/Compliance Risk |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Gmail | API | High when limited to read-only scopes. | Medium; depends on API/tenant logging. | Medium; scope configuration required. | Medium; API quotas apply. | Medium; app registration and monitoring. | Medium; mailbox data sensitivity. |
| Gmail | Connector | Medium; connector capabilities vary by vendor. | Medium; vendor log availability varies. | Medium; connector permissions review needed. | Low to Medium; vendor-managed throttling. | Medium to High; vendor onboarding required. | Medium; third-party processing risk. |
| Gmail | Export | Low; export may exceed read-only needs. | Low; export logs limited. | High; export permissions can be broad. | Low; batch export. | High; manual export management. | High; data handling exposure. |
| SharePoint | API | High when scoped to read-only endpoints. | Medium; dependent on tenant audit logs. | High; site/library permission complexity. | Medium; API throttling and paging. | Medium; app registration and consent. | Medium; document sensitivity and access scope. |
| SharePoint | Connector | Medium; connector abstraction varies. | Medium; vendor log availability varies. | High; connector permissions mapping to sites. | Low to Medium; vendor-managed throttling. | Medium to High; vendor onboarding required. | Medium; third-party processing risk. |
| SharePoint | Export | Low; export may overshoot read-only targets. | Low; export logs limited. | High; export permissions can be broad. | Low; batch export. | High; manual export management. | High; data handling exposure. |
| Microsoft Word | API | Medium; depends on storage repository API. | Low to Medium; repository audit logs vary. | Medium; repository permissions needed. | Medium; repository API throttling. | Medium; integration setup varies by repo. | Medium; document content sensitivity. |
| Microsoft Word | Connector | Medium; connector capabilities vary. | Medium; vendor log availability varies. | Medium; connector permissions review needed. | Low to Medium; vendor-managed throttling. | Medium to High; vendor onboarding required. | Medium; third-party processing risk. |
| Microsoft Word | Export | Low; export often exceeds read-only intent. | Low; export logs limited. | Medium to High; export permissions may be broad. | Low; batch export. | High; manual export management. | High; data handling exposure. |

## Constraints and Assumptions
- No live credential testing performed.
- Documentation and admin confirmation only.

## Observations
- API approaches provide the highest read-only scope fidelity but require careful scope management and tenant permissions.
- Connector approaches introduce vendor dependency and variable audit/logging coverage.
- Export approaches increase compliance risk and administrative overhead due to broad access and manual handling.

## Open Questions
- Which approach minimizes compliance risk?
- Which approach best supports future Stage 3 sequencing?
