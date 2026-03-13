---
id: 04_initiatives__system_portfolio__01_active_roadmaps__stage3__stage3_8__stage3_8_content_control_validation_spec_md
title: "Stage 3.8 — Template Content Control Validation Specification"
owner: ML1
status: active
created_date: 2026-02-12
last_updated: 2026-02-12
tags: [stage3, validation, content-control, template, bridge]
---

# Template Content Control Validation Specification

## 1. Purpose

The SB Graph Bridge must validate that:

- Any content-control tag referenced in a bridge request
- Actually exists in the target `.docx` template
- Matches the approved template registry

This prevents:

- Hallucinated tags
- Silent content corruption
- Invalid field injection

---

## 2. Validation Requirements

Before execution, bridge must:

1. Download template `.docx`
2. Inspect content controls (OpenXML)
3. Extract all content control tags
4. Compare against fields provided in request

---

## 3. Validation Rules

### Rule 1 — No Unknown Tags

If request contains:

```json
{
  "fields": {
    "ClientName": "...",
    "FooBar": "..."
  }
}
```

And `FooBar` is not a content-control tag in template:

→ Execution must fail.

### Rule 2 — No Silent Dropping

Bridge may NOT silently ignore unknown tags.

Unknown tag → explicit validation error.

### Rule 3 — No Invention

Bridge may NOT add tags not provided in request.

Template registry is source of truth.

### Rule 4 — Registry Consistency (Optional Advanced Phase)

Maintain template registry:

```json
{
  "template_file_id": [
    "ClientName",
    "ContactName",
    "MatterNumber"
  ]
}
```

Bridge may optionally:

- Validate template structure against registry
- Fail if template has drifted

(Registry validation can be Stage 3.8 pressure test or Stage 3.9 refinement.)

---

## 4. Execution Flow Update

New Phase inserted before upload:

**Phase 5.5 — Template Content Control Validation**

Order becomes:

1. Schema validation
2. Consistency check
3. QA gate
4. Auth
5. Preconditions
6. **5.5 Template validation**
7. Execute

---

## 5. Failure Modes

Bridge must fail if:

- Template cannot be downloaded
- Template is not `.docx`
- `fields` contains unknown tag
- Registry mismatch (if enabled)

---

## 6. Security Rationale

Without validation:

- Claude could hallucinate fields
- Invalid tags could be injected
- Metadata governance could drift silently
- Template changes could go undetected

This validation step prevents semantic corruption.

---

## 7. Stage 3.8 Completion Criteria

Content control validation is considered complete when:

- Bridge extracts tags from template
- Bridge rejects unknown tags
- Pressure test confirms enforcement
- Registry (if implemented) detects drift
