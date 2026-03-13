# Purpose
Draft an email response or summary for ML1 review, with explicit labeling and provenance.

# Canonical Inputs (MUST USE)
- 03_TEMPLATES/STAGE3/NEUTRAL_SUMMARY_FORMAT.md (v1.0)
- 01_DOCTRINE/02_policies/POL-001_Output_Labeling_Requirement.md (POL-001)
- 01_DOCTRINE/02_policies/POL-002_Provenance_Requirement.md (POL-002)
- 01_DOCTRINE/02_policies/POL-004_External_Output_Approval_Requirement.md (POL-004)
- 01_DOCTRINE/02_policies/POL-005_Low_Confidence_Escalation.md (POL-005)
- 01_DOCTRINE/02_policies/DOCTRINE-2026-005-NO_FICTIONAL_EXECUTION_CONSTRUCTS.md (DOCTRINE-2026-005)

# Steps
1. Create or confirm the run folder `06_RUNS/<run_id>/` and record the run id.
2. Gather the source email thread and any matter context from `05_MATTERS/<matter_id>/context.md` if applicable.
3. Draft a neutral summary of source facts using `03_TEMPLATES/STAGE3/NEUTRAL_SUMMARY_FORMAT.md` before composing the response.
4. Draft the email response with clear scope and any required action requests, keeping it non-authoritative and review-ready.
5. Cite referenced canon artifacts inline (include the exact repo path) where they govern content or structure.
6. If confidence is low or the email is external/client-facing, flag and require ML1 approval per POL-005 and POL-004.
7. Ensure output labeling and provenance are present per POL-001 and POL-002.
8. Save the draft to the run folder using the naming convention below.

# Output Requirements
- Output file: `06_RUNS/<run_id>/email__<short_slug>.md`
- Include `status: draft` in frontmatter where applicable.
- Include an explicit output label and provenance footer.
- Do not send or mark as approved without an ML1 approval artifact.

# Provenance Footer (MANDATORY)
Derived from: <list of canon paths>
Doctrine refs: <list of policy/protocol ids>
Run id: <run folder name>
Date: <YYYY-MM-DD>
Status: DRAFT (unless ML1-approved artifact exists)
