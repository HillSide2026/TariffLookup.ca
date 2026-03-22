# Skill: Regression Fixture Authoring

Purpose:
- Write table-driven or explicit regression cases that protect lookup behavior.

Use when:
- classifier, normalization, or ambiguity logic changes
- new EU rows are added

Required behavior:
- cover positive, negative, ambiguous, and fallback behavior where relevant
- keep assertions specific to the changed behavior
- prefer readable, maintainable cases

Outputs:
- regression test
- fixture expansion
- behavioral expectation note
