---
name: story-kickoff
description: Starts work on an Azure DevOps work item (story, bug or task) — fetches it, summarises it, investigates the codebase, triages complexity, and drafts an implementation plan before any code is written. Use when asked to pick up, start, plan or investigate an ADO story, ticket, bug or work item by ID.
argument-hint: <work-item-id>
disable-model-invocation: true
---

# Story Kickoff

Takes a work item ID and gets from "ticket assigned" to "approved plan" without skipping the thinking. Do not write code until the plan (or the trivial-path go-ahead) is approved.

Needs `AZURE_DEVOPS_ORG` and `AZURE_DEVOPS_PAT` in the shell environment. Never print, log or write the PAT anywhere.

## Workflow

1. **Fetch the work item** `$ARGUMENTS`:
   ```
   curl -s -u ":$AZURE_DEVOPS_PAT" "https://dev.azure.com/$AZURE_DEVOPS_ORG/_apis/wit/workitems/$ARGUMENTS?\$expand=all&api-version=7.1"
   ```
   Extract title, type, description or repro steps, acceptance criteria, state, priority, assignee, area and iteration path, tags, comments, linked items and attachments. Fields are HTML — strip the markup.
   If the fetch fails (auth error, not found, network error, unparseable response), stop, explain why, and do not continue.
2. **Summarise first.** Title, state, priority, assignee, and a plain-language restatement of the ask. Confirm you understood it before going further.
3. **Investigate the codebase.** Find the modules, routes, controllers and DB tables the ticket touches. Verify against current code — never rely on the ticket text alone.
4. **Triage.** Classify as Trivial or Standard/complex using `reference/triage-criteria.md`. When unsure, it is Standard/complex.
5. **Trivial path:** state the one-line plan and the files you will touch, confirm no schema change, ask for a quick go-ahead, then implement. No Plan Mode, no working doc.
6. **Standard/complex path:**
   1. **Ambiguity check.** If any business requirement is unclear, stop and ask the user with `AskUserQuestion`. Never infer or invent business rules.
   2. **Risk assessment.** Cover backward compatibility, performance, security and deployment. If a category has no risk, say so explicitly.
   3. **Plan Mode.** Enter Plan Mode and draft the plan: confirmed scope and decisions, phases, files to touch, the risk assessment, whether a schema change is needed (state "no migration needed" if not), edge cases, open questions. Get approval before coding.
   4. **Save the working doc** using `templates/ticket-plan-template.md` as `docs/tickets/$ARGUMENTS-<short-slug>.md`.
7. **Implement.**
   - Trivial: make the change, then give the user a short ticket-ready comment (what changed, why, which files) — it is the only record on this path.
   - Standard/complex: work phase by phase, track steps with the todo list, and append a dated note to the doc's Progress Log after each phase.

## Rules

- Never change the work item's state or assignment; the user does that.
- The working doc is for the life of the ticket only. If the repo does not already ignore it, remind the user to add `docs/tickets/` to `.gitignore` rather than committing it.
- Never invent business rules or acceptance criteria. Missing information goes in "Open questions".
- Do not skip a risk category silently.
