# Skill: Queue Status Maintenance

Purpose:
- Keep `EU_NORMALIZATION_QUEUE.md` aligned with the live dataset and code behavior.

Use when:
- normalized rows are added
- blocked or manual-review states change

Required behavior:
- ensure every unresolved or newly resolved code is reflected in the queue
- keep status wording consistent with live logic
- remove stale queue states when they are resolved

Outputs:
- queue update
- stale-entry cleanup
- state-sync note
