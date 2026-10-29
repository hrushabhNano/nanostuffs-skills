---
name: nanostuffs-api-docs
description: Generates API reference documentation for Node.js backends (Express, NestJS) by reading route, middleware and validation code — method, path, auth, request params and body, response shape, error codes and examples for every endpoint. Use when asked to document an API, write endpoint or API docs, create an API reference or Swagger/OpenAPI spec, update docs/API.md, or hand APIs over to a frontend, mobile or client team.
allowed-tools: Read Grep Glob
---

# Nanostuffs API Docs

Writes API docs that a frontend, mobile or client developer can integrate against without reading the backend code.

## Workflow

1. **Find the entry point and mounts.** Locate the app entry (`app.js`, `server.ts`, `main.ts`, `src/index.*`), every `app.use('/prefix', router)` or NestJS `@Controller('prefix')`, and any global prefix (`setGlobalPrefix`, `/api/v1`). Build full paths from these.
2. **List every route first.** Grep for `(app|router)\.(get|post|put|patch|delete)\(` and NestJS `@(Get|Post|Put|Patch|Delete)\(`. Write the list (method · full path · file:line) before documenting anything.
3. **Document each endpoint** from its handler and middleware chain:
   - **Auth** — middleware or guards (`authenticate`, `verifyToken`, `passport.authenticate`, `@UseGuards`) and any role or permission checks
   - **Request** — path params, query, body and required headers. Take types and required fields from zod / joi / express-validator / class-validator DTOs first, then from `req.params|query|body` usage
   - **Responses** — every `res.status(...).json(...)` or returned value with its status code. Follow calls into services only as far as needed to know the response shape
   - **Errors** — status codes thrown or passed to `next(err)`, and the shape the central error handler returns
4. **Write the doc.** Fill `templates/api-doc-template.md`, grouping endpoints by resource in the order the app mounts them. Save to `docs/API.md` unless the user names another path.
5. **Self-check before returning:**
   - Every route from step 2 is documented or listed under "Not documented" with a reason
   - Request and response examples use only fields that exist in the code
   - No secret values, tokens or real customer data appear anywhere
   - Anything not confirmed from the code is marked *to confirm*

## Rules

- Document what the code does, not what it should do. If behaviour looks wrong (e.g. 200 on failure, missing validation), document it as-is and add it to "Notes for the backend team".
- Never copy values from `.env`, config files, seeds or logs. Examples use placeholder data (`user@example.com`, `"id": "64f1c2a9e8b7d3a1c5f0b123"`).
- Mark deprecated, internal and debug routes as such rather than hiding them.
- Markdown is the default. Produce OpenAPI / Swagger YAML only when asked.
- For a large API (40+ endpoints), write one file per resource under `docs/api/` and keep `docs/API.md` as the index.
