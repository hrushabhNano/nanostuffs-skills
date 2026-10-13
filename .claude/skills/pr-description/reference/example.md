# Example output

```markdown
# PROJ-482 Refresh Salesforce token on 401 instead of failing the sync

## Summary
Field-sales sync no longer fails when the Salesforce access token expires mid-session. The API client now refreshes the token once and retries the request.

**Type:** bug fix
**Ticket:** PROJ-482

## Why
Users saw "Sync failed" after about two hours. Expired access tokens returned 401, and the client had no refresh handling, so the whole sync aborted.

## What changed
- **API client:** `sfClient.js` intercepts 401, calls the refresh endpoint once, and retries the original request. A second 401 surfaces the error as before.
- **Auth store:** refreshed token is saved so later calls reuse it.
- **Tests:** added unit tests for refresh success, refresh failure and no retry loop.

## How to test
1. Set `SF_TOKEN_TTL=60` in your local `.env` to shorten token life.
2. Start the app and run a sync.
3. Wait 60 seconds and run another sync.
4. Expected: sync succeeds; logs show one "token refreshed" line.

**Automated tests:** added `sfClient.test.js` (`npm test -- sfClient`)

## Risks and rollback
- New env var `SF_TOKEN_TTL` (optional, defaults to provider value).
- Touches authentication: please review the retry limit carefully.
- **Rollback:** revert only. No migration.

## Reviewer checklist
- [ ] Description matches the diff
- [ ] No secrets or client data committed
- [ ] Tests pass locally and in CI
```