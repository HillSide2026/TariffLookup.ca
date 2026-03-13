---
id: 04_initiatives__system_portfolio__01_active_roadmaps__stage3__stage3_8__stage3_8_action_plan_md
title: Stage 3.8 — SB Execution Bridge (Hardened)
owner: ML1
status: active
created_date: 2026-02-12
last_updated: 2026-02-12
tags: [stage3, roadmap, sharepoint, execution, bridge]
---

# Stage 3.8 — SB Execution Bridge (Hardened)

## Status

- **Status:** ✅ COMPLETE
- **Owner:** ML1
- **Authority Gate:** ML1 sole approval authority; ML2 executes only upon explicit ML1 trigger

---

# 1. Core Objective

Define, harden, and validate the full execution contract for:

- Draft generation
- Metadata enforcement
- Promotion governance
- Idempotent run logging
- SharePoint enclave integrity

Stage 3.8 closes only when execution is:

- Contractually constrained
- Schema-validated
- Template-validated
- Idempotent
- Audit-complete

---

# 2. Scope

## In-Scope

| Domain | Deliverable |
|--------|------------|
| Execution Governance | Formal lifecycle + authority doctrine |
| Metadata Contract | SharePoint column schema + state model |
| Template Registry | Authoritative template inventory + versioning |
| Content Control Validation | Pre-execution template validation |
| Bridge Executor | 6-phase validation + execution pipeline |
| Schema Hardening | Strict JSON contract enforcement |
| Idempotency Model | RunID + filename collision prevention |
| Failure Recovery | Partial execution remediation protocol |
| Discovery Infrastructure | Live SharePoint state verification |
| Pressure Testing | Edge-case and drift testing |

## Out-of-Scope

| Domain | Rationale |
|--------|----------|
| External propagation | Stage 4 concern |
| Auto-remediation | ML1-only |
| Analytics / metrics | Stage 3.9+ |
| Advanced permission minimization | Post-stabilization |

---

# 3. Hard Constraints

1. ML1 retains sole authority for promotion.
2. ML2 may generate drafts only via validated bridge request.
3. DRAFTS are write-once.
4. FINAL is append-only.
5. Every execution produces a durable run log.
6. No execution without schema + QA gate pass.
7. No template usage outside registry.

---

# 4. Lifecycle State Model

Minimum required states:

- `DRAFT`
- `READY_FOR_REVIEW`
- `APPROVED`
- `FINAL`
- `REJECTED`
- `PROMOTION_INCOMPLETE`

Lifecycle transitions must be:

- Explicit
- Logged
- Authority-bound

---

# 5. Required Deliverables

## 5.1 Governance

- `STAGE3.8_EXECUTION_GOVERNANCE.md`
- Lifecycle state transition matrix
- Authority mapping (ML1 vs ML2)

## 5.2 Metadata Contract

- SharePoint column schema (authoritative)
- Valid value constraints
- Required field matrix per lifecycle state
- Concurrency + version handling rules

## 5.3 Template Registry

File: `02_PLAYBOOKS/_assets/execution/reference/TEMPLATE_REGISTRY.json`

Must include per template:

- `file_id`
- `canonical_name`
- `version`
- `doc_type`
- `allowed_content_controls`
- `required_content_controls`
- `lifecycle_compatibility`

Bridge must validate requests against registry.

## 5.4 Content Control Validator

Bridge must:

- Extract content control tags from template
- Reject unknown fields
- Flag missing required controls
- Block execution on mismatch

## 5.5 Bridge Executor Hardening

Bridge must enforce:

1. Schema validation (`additionalProperties: false`)
2. Cross-field consistency checks
3. RunID uniqueness across RUN_LOGS
4. Duplicate filename rejection
5. Template existence verification
6. Content control validation
7. Metadata patch verification
8. Run log durability confirmation

Execution must fail if:

- Metadata patch fails
- Run log write fails
- Template registry mismatch occurs

## 5.6 Idempotency & Collision Model

Bridge must enforce:

- Unique RunID across entire enclave
- Write-once DRAFT filename rule
- Hash-based replay detection (optional enhancement)
- Re-run rejection unless explicitly authorized

## 5.7 Partial Failure Doctrine

If execution fails mid-pipeline:

- Mark file `PROMOTION_INCOMPLETE`
- Write error log to RUN_LOGS
- Block further promotion
- Surface remediation path

No silent partial states permitted.

## 5.8 Discovery Infrastructure

`00_SYSTEM/scripts/sharepoint_discovery.py` must verify:

- Drive existence
- Folder structure integrity
- Column schema correctness
- Template inventory alignment with registry
- Permission availability
- Drift detection (moved/deleted folders)

Discovery output stored under: `09_INBOX/_sources/sharepoint/discovery/`

---

# 6. Acceptance Criteria

- [ ] Governance doctrine defined with state transition matrix
- [ ] Metadata contract covers all 9 columns with per-state required field rules
- [ ] Template registry complete with all 6 templates and file IDs
- [ ] Bridge executor passes dry-run validation (all 3 pre-execution phases)
- [ ] Schema enforces all structural and value constraints
- [ ] Idempotency model prevents duplicate drafts
- [ ] Failure recovery documented for each failure point
- [ ] Discovery scanner produces accurate live inventory
- [ ] Pressure test scenarios documented and executed
- [ ] No authority creep introduced

---

# 7. Test Suite

| Test | Input | Pass Criteria |
|------|-------|---------------|
| TEST-SB1 | Discovery scan against live SharePoint | Inventory matches manual inspection |
| TEST-SB2 | Bridge dry-run with sample request | Schema + consistency + QA all pass |
| TEST-SB3 | Bridge live run | Draft uploaded, metadata set, run log written |
| TEST-SB4 | Duplicate filename in DRAFTS | Bridge rejects (write-once rule) |
| TEST-SB5 | Invalid template file_id | Schema validation rejects |
| TEST-SB6 | QA score < 11 or required_perfect != 2 | QA gate rejects |
| TEST-SB7 | Missing SB Execution folder | Precondition check fails gracefully |
| TEST-SB8 | Simulated metadata set failure | Bridge reports partial state + audit gap |

---

# 8. Execution Tracking

## Phase 1: Governance (Complete)

| Item | Status | Notes |
|------|--------|-------|
| Draft promotion control doctrine | ✅ | `STAGE3.8_DRAFT_DOCTRINE_SB_EXECUTION_PROMOTION_CONTROL.md` |
| Draft SharePoint metadata trigger spec | ✅ | `STAGE3.8_DRAFT_SPEC_SHAREPOINT_METADATA_PROMOTION_TRIGGER.md` |

## Phase 2: Discovery + Bridge (Complete)

| Item | Status | Notes |
|------|--------|-------|
| SharePoint discovery scanner | ✅ | `00_SYSTEM/scripts/sharepoint_discovery.py` |
| Live discovery scan | ✅ | Site, drive, folders, columns inventoried |
| SB Graph Bridge executor | ✅ | `00_SYSTEM/scripts/sb_graph_bridge.py` |
| Bridge request schema | ✅ | `00_SYSTEM/scripts/sb_bridge_request.schema.json` |
| Bridge dry-run validation | ✅ | All phases pass |
| Sample bridge request | ✅ | `00_SYSTEM/scripts/request.json` |

## Phase 3: Hardening (Complete)

| Item | Status | Notes |
|------|--------|-------|
| Execution governance document | ✅ | `STAGE3.8_EXECUTION_GOVERNANCE_DOC.md` |
| Template registry | ✅ | `02_PLAYBOOKS/_assets/execution/reference/TEMPLATE_REGISTRY.json` (delivered Phase 2) |
| Content control validation spec | ✅ | `STAGE3.8_CONTENT_CONTROL_VALIDATION_SPEC.md` |
| Content control validation impl | ✅ | Phase 4 (registry) + Phase 7 (OpenXML introspection) in bridge |

## Phase 4: Live Execution (Complete)

Provisioning script: `00_SYSTEM/scripts/setup_sb_execution.py`

| Item | Status | Notes |
|------|--------|-------|
| Provisioning script | ✅ | `00_SYSTEM/scripts/setup_sb_execution.py` (--verify / --provision) |
| Add write permissions to Azure app | ✅ | Files.ReadWrite.All + Sites.Manage.All granted |
| Run `--verify` to confirm drive access | ✅ | Drive `b!aepYh7...` confirmed accessible |
| Run `--provision` to create columns | ✅ | 9 SB_* columns created |
| Verify folder structure | ✅ | Folders confirmed (IDs match Fixed Target IDs) |
| Live bridge execution test | ✅ | Bridge execution complete |
| Re-run discovery to confirm setup | ✅ | Folders + columns verified |

## Phase 5: Pressure Testing (Complete)

Test suite: `00_SYSTEM/scripts/pressure_test_bridge.py` — **52/52 passed**

| Item | Status | Notes |
|------|--------|-------|
| Edge-case ambiguity testing | ✅ | 16 tests: missing keys, malformed patterns, injection, extra keys |
| Authority violation testing | ✅ | 6 tests: executor/authority swap, pre-populated approval fields |
| Write-once enforcement | ✅ | 3 tests: overwrite=true/null/missing |
| QA gate enforcement | ✅ | 7 tests: FAIL result, score below min, dimension tampering |
| Consistency violation testing | ✅ | 6 tests: cross-field mismatches, boundary escape |
| Metadata corruption scenarios | ✅ | 7 tests: field injection, extra keys, invalid enums |
| Registry enforcement | ✅ | 2 tests: unknown file_id, version mismatch |
| Cross-matter contamination test | ✅ | 1 test: filename-to-runid isolation (gap fixed) |
| Boundary escape testing | ✅ | 3 tests: path traversal, folder redirect, drive redirect |

Fixes applied during pressure testing:
- Hardened manual validation fallback (patterns, additionalProperties, nested required)
- Added filename-to-runid cross-check in consistency phase
- Fixed sample request.json to use actual template file_id from registry

---

# 9. Risks & Controls

| Risk | Likelihood | Impact | Control |
|------|------------|--------|---------|
| Write permissions not granted | Medium | High | Discovery scanner verifies before bridge runs |
| Duplicate RunID collision | Low | Medium | Bridge checks DRAFTS for existing filename |
| Metadata set fails after upload | Medium | High | Bridge reports partial state + audit gap |
| Promotion without audit log | Low | Critical | If logging fails, promotion fails |
| SB Execution folder deleted/moved | Low | High | Discovery scanner detects drift |
| Template used outside registry | Medium | High | Schema enforces file_id allowlist |
| Content control name mismatch | Medium | Medium | Pre-execution template validation |

---

# 10. Fixed Target IDs

```json
{
  "drive_id": "b!aepYh7XvLkaJQFKWL0yhBXltDNo4pJRJpSPL-X-uZ-tNtZwBKQHoRYMyWJLL2q-P",
  "execution_root_id": "017KHWIVBSTHL7MVN6YRE3YPVEOJHJHOW6",
  "drafts_id": "017KHWIVDDUFGTNSDDYJGZF2V5OXBVFLOI",
  "final_id": "017KHWIVHUT4KSP2ZNSVG2HVUUXL64OPGC",
  "run_logs_id": "017KHWIVEQGJFT2AVXQZE2WURHXZND5WOH",
  "templates_id": "017KHWIVG2MPDGE6XXL5BKG2IWATADMOPQ"
}
```

---

# 11. References

- Stage 3 Authorization: `STAGE3_AUTHORIZATION_KICKOFF.md`
- Stage 3.7: `STAGE3.7/STAGE3.7_ACTION_PLAN.md`
- Stage 3.9 (Consistency Metric): `STAGE3.9/STAGE3.9_ACTION_PLAN.md`
- Stage 3.10 (Metric Validation): `STAGE3.10/STAGE3.10_ACTION_PLAN.md`
- Draft Doctrine: `STAGE3.8_DRAFT_DOCTRINE_SB_EXECUTION_PROMOTION_CONTROL.md`
- Draft Spec: `STAGE3.8_DRAFT_SPEC_SHAREPOINT_METADATA_PROMOTION_TRIGGER.md`
- Discovery Scanner: `00_SYSTEM/scripts/sharepoint_discovery.py`
- Bridge Executor: `00_SYSTEM/scripts/sb_graph_bridge.py`
- Bridge Schema: `00_SYSTEM/scripts/sb_bridge_request.schema.json`
- Sample Request: `00_SYSTEM/scripts/request.json`
