---
name: client-status-update
description: Writes a weekly or sprint client status update — an email or a short report — from git history, merged PRs, ticket lists, standup notes or chat threads, with overall RAG status, completed work, work in progress, next week's plan, blockers, risks and decisions needed from the client. Use when asked for a status update, weekly report, client update email, sprint summary, progress report, or "what did we do this week" for a client or stakeholder.
---

# Client Status Update

Turns raw engineering activity into an update a client stakeholder can read in two minutes and act on.

## Workflow

1. **Set the frame.** Confirm the project / client name, the period (default: last 7 days) and the format: **email** (default) or **report**. If the user hasn't said, use the defaults and state them in one line.
2. **Gather material.** Use whatever the user gives: notes, ticket lists, chat threads. If you are in a git repo and nothing else is given, run:
   `git log --since="7 days ago" --no-merges --date=short --format="%h %ad %s%n%b"`
   and read merged PR titles from `git log --merges --since="7 days ago" --format="%s"`.
3. **Translate to outcomes.** Group commits by feature or module, then write one line per outcome in business language. Follow `reference/status-guide.md` for what to drop and how to rephrase.
4. **Classify** each outcome:
   - **Completed** — merged and deployed or ready for UAT. Say which environment if known.
   - **In progress** — started, not done. Give the next milestone, not a percentage, unless one is supplied.
   - **Next week** — planned work, 3–6 lines.
5. **Blockers, risks and decisions.** List what is waiting on the client (access, credentials, UAT feedback, content, sign-off), each with *what we need*, *from whom* and *by when*. List risks to the timeline separately.
6. **Set the RAG status** using the criteria in `reference/status-guide.md`, with a one-line reason.
7. **Fill `templates/status-template.md`** in the chosen format.
8. **Self-check before returning:**
   - Nothing marked Completed that the material shows as unmerged or untested
   - Every blocker has an owner and a date (or "date to confirm")
   - Amber or Red status has a recovery action
   - No commit hashes, branch names, file paths, internal tool names or people's blame in the client-facing text

## Rules

- Write as the Nanostuffs team ("we"). Plain language; no jargon the client didn't use first.
- Never invent progress, dates or percentages. Use "to confirm" for anything not in the material.
- Do not include effort hours, internal rates or team-member performance unless the user asks.
- Bad news goes near the top, not buried under completed work.
- Dates in IST, written as `27 Oct` style. Keep the email body under 250 words.
- If the user asks for an internal version too, add a short "Internal notes" section after the client version with the technical detail removed from the client text.
