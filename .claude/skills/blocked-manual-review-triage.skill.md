# Skill: Blocked vs Manual-Review Triage

Purpose:
- Decide whether an unresolved EU group should be blocked-with-guidance or sent to manual review.

Use when:
- queue status is unclear
- guidance might be enough to avoid manual-review-only treatment

Required behavior:
- prefer `blocked-with-guidance` if the missing detail can be requested explicitly
- use `manual-review` when the system still lacks a stable safe path
- document the reason for the chosen state

Outputs:
- triage decision
- queue-status recommendation
- rationale note
