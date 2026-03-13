# System Admin Findings

## Summary
- BLOCKER: 0
- MAJOR: 4
- MINOR: 0
- INFO: 0

## MAJOR — Root directories not documented in FOLDER_MAP.md
Agent: SAA_FOLDER_MAP_DRIFT

Root directories exist that are not listed in the folder map.

Affected paths:
- logs/
- scripts/

## MAJOR — Missing required frontmatter fields
Agent: SAA_METADATA_ENFORCER

Missing frontmatter in 0 files; missing required fields in 1 files.

Affected paths:
- 01_DOCTRINE/04_procedural/DOCTRINE-2026-003-promotion-rules.md

## MAJOR — Broken internal links detected
Agent: SAA_REFERENCE_INTEGRITY

Detected broken internal links in 11 files.

Affected paths:
- 00_SYSTEM/agents/specs/AGENT_TYPOLOGY.md
- 00_SYSTEM/agents/specs/PRACTICE_AREA_MASTER_AGENT_SPEC.md
- 02_PLAYBOOKS/substantive/contracts/README.md
- 02_PLAYBOOKS/substantive/contracts/agents/CONTRACTS_MASTER_AGENT.md
- 02_PLAYBOOKS/substantive/contracts/agents/README.md
- 02_PLAYBOOKS/substantive/corporate/agents/CORPORATE_LAW_MASTER_AGENT.md
- 02_PLAYBOOKS/substantive/financial_services/payments/agents/PAYMENTSERVICES_MASTER_AGENT.md
- 02_PLAYBOOKS/substantive/financial_services/payments/agents/README.md
- 05_MATTERS/INDEX.md
- 06_RUNS/03_TESTS/agent_outputs/PHASE3.2_FAILURE_MODE_TEST.md
- 06_RUNS/03_TESTS/agent_outputs/PHASE3.3_E2E_TEST_RESULTS.md

## MAJOR — Playbooks missing from registry
Agent: SAA_REGISTRY_SYNC

Playbook folders with required files are not listed in PLAYBOOK_INDEX.md.

Affected paths:
- 02_PLAYBOOKS/core/README.md
- 02_PLAYBOOKS/substantive/README.md
- 02_PLAYBOOKS/system/README.md
- 02_PLAYBOOKS/execution/README.md

