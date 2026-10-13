---
name: pr-description
description: Writes a pull request description from a git branch or diff — summary, what changed and why, how to test, risks and rollback, and a reviewer checklist. Use when asked for a PR description, pull request summary, PR body, "write up this branch", "describe my changes", merge request text, or when the user is about to open a PR and needs the description drafted. Also use when a PR description needs rewriting or tightening.
---

# PR Description

Produces a PR description a reviewer can understand in two minutes and a tester can follow without asking questions. Built from the actual diff, never from guesswork.

## Workflow

1. **Find the range.** Detect the base branch (`origin/main`, `origin/develop`, or what the user names). Use only read-only git commands:
   - `git branch --show-current`
   - `git log <base>..HEAD --oneline`
   - `git diff <base>...HEAD --stat`
   - `git diff <base>...HEAD` (for large diffs, read the most important files only and say so)
   If there are no commits ahead of base, or uncommitted changes exist, tell the user and ask which to describe.
2. **Get the why.** Take it from commit messages, the branch name (ticket ID such as `PROJ-123`), and anything the user said. If the reason is not clear from these, ask one short question. Do not invent a motivation.
3. **Classify the change.** One of: feature, bug fix, refactor, performance, chore/deps, docs, config/CI. Mixed PRs: say so and list each part separately.
4. **Scan for risk signals** using `reference/risk-signals.md`. Every signal found goes under "Risks and rollback".
5. **Write "How to test" only from evidence.** Use test files changed in the diff, scripts in `package.json`, and the behaviour the code actually implements. If you cannot tell how it was tested, write "Testing not stated: author to confirm" rather than inventing steps.
6. **Fill `templates/pr-template.md`.** Remove sections that do not apply (for example Screenshots on a backend-only change). Keep the title under 72 characters, imperative mood, ticket ID first if known.
7. **Self-check** against the rules below, then output.

## Output

Return the description in a single markdown code block so it can be pasted straight into GitHub, Bitbucket or GitLab. Save to a file only if asked. Under the block, list at most three **Open items** (things you could not determine). Never run `git push`, `gh pr create` or any command that changes the repo or remote unless the user explicitly asks.

## Rules

- Describe what the code does, not what the commit messages hope it does. If they disagree, trust the diff and mention it.
- Never include secret values (keys, tokens, passwords, connection strings). If the diff contains one, warn the user at the top of the reply and refer to it by file and line only.
- No client names, internal rates or private customer data in the description unless it is already in the repo's own docs.
- Flag breaking changes, migrations, new env vars and new dependencies explicitly; reviewers must not discover them by reading the diff.
- Summary is plain language; technical detail goes under "What changed".
- Group "What changed" by area (API, UI, DB, config), not file by file.
- Do not pad. A three-line fix gets a short description.
- If information is missing, list it under Open items instead of assuming.

## Reference files

- `templates/pr-template.md`: the description structure to fill.
- `reference/risk-signals.md`: what to look for in a diff and how to word the warning.
- `reference/example.md`: one finished description showing the expected tone and length.
