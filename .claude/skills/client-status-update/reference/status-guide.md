# Status update guide

## RAG status

| Status | Use when |
|---|---|
| **Green** | On track for the next milestone; no blocker older than 2 working days |
| **Amber** | Milestone at risk by up to 1 week, or a client-side blocker open more than 2 working days, or scope change under discussion |
| **Red** | Milestone will slip by more than 1 week, a production issue is open, or a blocker has no owner |

Amber and Red always need a recovery action: what we are doing and what we need from the client.

## Drop these from the client version

- Merge commits, version bumps, lint / formatting, dependency updates
- Refactors and internal tooling changes, unless they fix something the client noticed
- WIP / fixup commits; fold them into the outcome they belong to
- Commit hashes, branch names, file paths, PR numbers

## Commit → client language

| Commit message | Client-facing line |
|---|---|
| `fix: handle 401 on SF token expiry, add refresh` | Fixed the Salesforce sync stopping when the login session expires; it now reconnects automatically |
| `feat(orders): pagination + filters on list API` | Order list now loads page by page and can be filtered by status and date |
| `chore: bump RN to 0.76, fix android build` | (drop — or, if it unblocked a release: "Updated the mobile app platform to keep Android builds working") |
| `wip offline sync queue` ×6 | Offline sync: work in progress; next milestone is syncing visits captured without network |

## Blocker line format

`<What we need> — from <client role/name> — by <date> — impact if late: <one phrase>`

Example: *UAT test accounts for the dealer portal — from Client IT — by 29 Oct — impact if late: UAT start moves by the same number of days.*
