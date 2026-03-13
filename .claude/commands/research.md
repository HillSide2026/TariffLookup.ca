# Purpose
Produce a neutral, source-bound research summary suitable for ML1 review and downstream synthesis.

# Canonical Inputs (MUST USE)
- 03_TEMPLATES/STAGE3/NEUTRAL_SUMMARY_FORMAT.md (v1.0)
- 01_DOCTRINE/02_policies/POL-001_Output_Labeling_Requirement.md (POL-001)
- 01_DOCTRINE/02_policies/POL-002_Provenance_Requirement.md (POL-002)
- 01_DOCTRINE/02_policies/POL-003_Novel_Policy_Prohibition.md (POL-003)
- 01_DOCTRINE/02_policies/POL-005_Low_Confidence_Escalation.md (POL-005)
- 01_DOCTRINE/02_policies/DOCTRINE-2026-005-NO_FICTIONAL_EXECUTION_CONSTRUCTS.md (DOCTRINE-2026-005)

# Steps
1. Create or confirm the run folder `06_RUNS/<run_id>/` and record the run id.
2. Gather source materials and note any missing inputs; if matter-related, pull `05_MATTERS/<matter_id>/context.md` when available.
3. Draft the summary using `03_TEMPLATES/STAGE3/NEUTRAL_SUMMARY_FORMAT.md` and keep to neutral, source-bound statements.
4. Cite referenced canon artifacts inline (include the exact repo path) where they govern content or structure.
5. Flag low-confidence items explicitly and escalate per POL-005 if needed.
6. Ensure output labeling and provenance are present per POL-001 and POL-002.
7. Save the draft to the run folder using the naming convention below.

# Output Requirements
- Output file: `06_RUNS/<run_id>/research__<short_slug>.md`
- Include `status: draft` in frontmatter where applicable.
- Include an explicit output label and provenance footer.
- Do not promote or label as approved without an ML1 approval artifact.

# Provenance Footer (MANDATORY)
Derived from: <list of canon paths>
Doctrine refs: <list of policy/protocol ids>
Run id: <run folder name>
Date: <YYYY-MM-DD>
Status: DRAFT (unless ML1-approved artifact exists)
