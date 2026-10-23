---
name: env-config-impact
description: Checks whether adding or changing an environment variable, API key, Salesforce URL, CORS origin, or credential will affect the Node backend, the Vite frontend build, Heroku config, or both. Use when the user adds an env var, asks if Heroku keys will work, mentions VITE_ vs RAZORPAY_KEY_ID, production vs local config, grant_type, CORS_ORIGIN, or whether live Razorpay / Salesforce credentials will reach the browser.
---

# Env config impact

Produces a short impact report before an env or credential change is treated as done. Complements a dependency-impact skill: that one is for npm packages; this one is for config surfaces.

## Workflow

1. Identify the change. Name, value kind (url, public key id, secret, grant type), and where the user wants it (local `.env`, `client/.env`, Heroku). Never copy secret values into the report.
2. Classify using `reference/ghs-env-surfaces.md`:
   - Frontend build — `import.meta.env.VITE_*` in `client/` (baked at heroku-postbuild / vite build)
   - Backend runtime — `process.env.*` in `index.js`, `routes/`, `razorpay.js` (read when Node starts)
   - Both — same logical setting in client and server (Salesforce instance URL, Razorpay key id)
3. Search the target repo for the variable name and related names (`VITE_`, `RAZORPAY_`, `INSTANCE_URL`, `CORS_`).
4. Pairing rules:
   - Frontend cannot read `RAZORPAY_KEY_ID`. Checkout needs `VITE_RAZORPAY_KEY_ID` with the same key id.
   - Secrets (`*_SECRET`, passwords) must never get a `VITE_` copy.
   - `VITE_*` changes on Heroku need a rebuild/redeploy, not only a config-var save.
   - Production token grant is `client_credentials` when `VITE_APP_ENV` is PROD / QA (`routes/token.js`).
5. Fill `templates/impact-report.md`.
6. Stop with open questions if a required pair is missing.

## Rules

- Never paste secrets into chat, git, or the report. Say "live secret (set)" / "missing".
- Empty Salesforce records: `[]` is a data/org issue, not an env miss.
- Local images with an empty API usually mean persisted localStorage (`categories-store`).
- If frontend key mode (`rzp_test_` vs `rzp_live_`) does not match backend key mode, verdict is Blocker.
