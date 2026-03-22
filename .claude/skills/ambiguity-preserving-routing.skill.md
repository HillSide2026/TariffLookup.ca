# Skill: Ambiguity-Preserving Routing

Purpose:
- Preserve ambiguity when the classifier cannot safely collapse to one trustworthy path.

Use when:
- multiple branches remain plausible
- guidance is safer than a forced answer

Required behavior:
- do not overstate confidence
- route toward `blocked-with-guidance` when the product needs more detail
- ensure user-facing reasoning remains honest

Outputs:
- ambiguity route
- confidence correction
- follow-up detail recommendation
