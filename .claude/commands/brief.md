# Purpose
Draft a matter brief using the canonical matter brief template.

# Canonical Inputs (MUST USE)
- 03_TEMPLATES/MATTER_TEMPLATE/MATTER_BRIEF.md (v1.0)
- 01_DOCTRINE/02_policies/POL-001_Output_Labeling_Requirement.md (POL-001)
- 01_DOCTRINE/02_policies/POL-002_Provenance_Requirement.md (POL-002)
- 01_DOCTRINE/02_policies/POL-004_External_Output_Approval_Requirement.md (POL-004)
- 01_DOCTRINE/02_policies/POL-006_Clarity_Single_Job_Requirement.md (POL-006)
- 01_DOCTRINE/02_policies/DOCTRINE-2026-005-NO_FICTIONAL_EXECUTION_CONSTRUCTS.md (DOCTRINE-2026-005)

# Steps
1. Create or confirm the run folder `06_RUNS/<run_id>/` and record the run id.
2. Pull matter context from `05_MATTERS/<matter_id>/context.md` and any existing matter artifacts.
3. Draft the brief using `03_TEMPLATES/MATTER_TEMPLATE/MATTER_BRIEF.md`, filling all sections with source-bound content.
4. Cite referenced canon artifacts inline (include the exact repo path) where they govern content or structure.
5. Ensure scope is explicit and the brief has a single primary job per POL-006.
6. Ensure output labeling and provenance are present per POL-001 and POL-002.
7. Save the draft to the run folder using the naming convention below.

# Output Requirements
- Output file: `06_RUNS/<run_id>/brief__<matter_id>__<short_slug>.md`
- Include `status: draft` in frontmatter where applicable.
- Include an explicit output label and provenance footer.
- Do not promote to `05_MATTERS/<matter_id>/` without ML1 approval.

# Provenance Footer (MANDATORY)
Derived from: <list of canon paths>
Doctrine refs: <list of policy/protocol ids>
Run id: <run folder name>
Date: <YYYY-MM-DD>
Status: DRAFT (unless ML1-approved artifact exists)
