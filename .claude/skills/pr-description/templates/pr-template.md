# <TICKET-ID> <Imperative title, under 72 characters>

## Summary
<2–3 sentences in plain language: what this PR does and why it matters.>

**Type:** <feature | bug fix | refactor | performance | chore | docs | config/CI>
**Ticket:** <link or ID, or "none">

## Why
<The problem or need. For bug fixes: what was broken and the root cause.>

## What changed
- **<Area, e.g. API>:** <change>
- **<Area, e.g. UI>:** <change>
- **<Area, e.g. DB / config>:** <change>

## How to test
1. <Setup step, if any>
2. <Action>
3. <Expected result>

**Automated tests:** <added / updated / none: list the files or commands>

## Risks and rollback
- <Breaking changes, migrations, new env vars, new dependencies, auth or permission changes>
- **Rollback:** <revert only | revert plus migration down | feature flag off | other>

## Screenshots
<Before / after, or delete this section>

## Reviewer checklist
- [ ] Description matches the diff
- [ ] No secrets or client data committed
- [ ] Tests pass locally and in CI
- [ ] Docs / README / changelog updated if behaviour changed
- [ ] Env vars and migrations noted above are applied in target environments