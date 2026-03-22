# Skill: Normalization Eligibility Evaluation

Purpose:
- Decide whether an EU row is safe to normalize.

Use when:
- updating `eu-normalization-service.ts`
- reviewing new or changed source snapshots

Required behavior:
- normalize only when the shared base outcome is stable
- reject rows where branch divergence changes the duty outcome materially
- encode restrictions explicitly when manual overrides are needed

Outputs:
- normalize / block / manual-review recommendation
- safety rationale
- required restriction note
