# API diagnostic — {method} {path}

| | |
|---|---|
| **Client** | React / React Native / other |
| **Server** | Express / other |
| **Environment** | local / UAT / production |
| **Status** | {HTTP status, or network / timeout / CORS} |

## 1. Problem summary

{What the user did, what they expected, what happened. No secrets.}

## 2. Environment and reproduction

- Endpoint and method:
- Client base URL (name the env variable, not a secret):
- How to reproduce:
- Logs or response used (redact tokens and customer data):

## 3. Confirmed findings

| # | Finding | Evidence (file:line or config) | Why it is confirmed |
|---|---|---|---|

## 4. Potential causes requiring verification

| # | Cause | Why it is still possible | Evidence needed |
|---|---|---|---|

## 5. Root cause and supporting evidence

**Status:** confirmed / not confirmed

{One paragraph. If several possibles remain, say so and do not pick a winner.}

## 6. Recommended fix

{Smallest change and why it addresses the confirmed cause. If the cause is not confirmed, say what to check next instead of a patch.}

## 7. Relevant file paths and code changes

- `{path}` — {what changes}

```diff
{targeted diff, or omit if the cause is not confirmed}
```

Side effects: {other callers, interceptors, or clients that share this path}

## 8. Regression tests

| Test | Exists? | What it should assert |
|---|---|---|

## 9. Verification results

| Command | Ran? | Result |
|---|---|---|

{If nothing was executed, write "not run" and why.}

## 10. Remaining questions

-
