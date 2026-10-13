# Risk signals to look for in a diff

If any of these appear, list them under "Risks and rollback" in one line each.

| Signal in the diff | Wording to use |
|---|---|
| New or changed files in `migrations/`, `*.sql`, schema or model changes | "Includes a DB migration: run before deploy. Rollback needs a down migration / manual step." |
| New `process.env.X`, changes to `.env.example`, config files | "New env var `X` required in all environments." (name only, never the value) |
| `package.json` dependency added or upgraded, lockfile changes | "Adds/upgrades `<pkg>` from `<old>` to `<new>`." Flag major version bumps. |
| Changed route paths, request or response shapes, status codes | "API contract change: clients on the old version may break." |
| Auth, middleware, JWT, OAuth, permission or role logic | "Touches authentication/authorization: needs focused security review." |
| Removed or renamed exports, props, or public functions | "Breaking change for any caller of `<name>`." |
| CI/CD, Dockerfile, build config, deploy scripts | "Changes build or deploy pipeline: verify on a non-production run first." |
| Native modules, `ios/`, `android/`, Podfile, Gradle (React Native) | "Native change: requires a new app build, not just a JS update." |
| Salesforce metadata, connected app, OAuth scopes, API version | "Salesforce config change: confirm org-side setup matches." |
| Large deletions or generated files | "Large diff is mostly generated/deleted code: review hand-written files first." |
| Hard-coded credential, token or key pattern | **Do not quote it.** Warn the user at the top of the reply: file and line only. |