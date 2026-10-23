# HTTP status guide

A status code narrows where to look. It does not name the root cause. Cite the file or log that confirms a cause before you call it confirmed.

## 400 Bad Request

Often a body, query, or header the server refuses before business logic. Also a wrong `Content-Type`, a JSON parse failure, or a client bug that sends the wrong shape.

Evidence: the validation error body (field names only), the schema, the object the client passes to Axios.

Next: diff the sent fields against the schema. Do not treat 400 as "the user typed something wrong" unless the handler says that.

## 401 Unauthorized

The server did not accept the credentials. Missing header, wrong scheme, expired token, bad signature, wrong audience, cookie not sent.

Evidence: whether the request interceptor set `Authorization`, what the auth middleware checks, the token expiry claim if it is already in a log (never print the token).

Next: confirm the header is present and which check failed. A missing header and an expired token are different fixes.

## 403 Forbidden

The identity was accepted and the action was refused. Role, permission, tenant, or agency check.

Evidence: the middleware or policy that returns 403, and the id it compared (tenant, agency, owner). Do not print customer data.

Next: compare the id the client sent with the id the check uses. A 403 is not a prompt to remove the check.

## 404 Not Found

No route matched, or a route matched and the resource was missing. Those are different.

Evidence: the method and full path after base URL joining, the mounted router, and any `findById` that returns null.

Next: look for a duplicated prefix, a trailing slash, a path param the client never substituted, or an unmounted router. Only call it a missing row if the handler ran and the lookup returned nothing.

## 405 Method Not Allowed

A route exists for that path under a different method.

Evidence: client method and the methods registered for that path.

Next: change the caller or the route, whichever contradicts the contract. Check for a CORS preflight only if the browser shows a failed `OPTIONS` and the real method never left the browser.

## 409 Conflict

State clash: duplicate unique key, version mismatch, illegal transition.

Evidence: the unique index or the state check that returns 409, and the field involved.

Next: decide whether the client should send an idempotency key, reload, or surface the conflict. Do not retry blindly.

## 422 Unprocessable Content

The body is syntactically valid and still fails a semantic rule. Some codebases use 400 for the same thing. Read the handler.

Evidence: the schema or rule that returns 422, and the field it names.

Next: same diff as 400. Do not assume 422 means a different layer than 400 without the code.

## 429 Too Many Requests

A limiter, or a client retry loop that tripped one.

Evidence: rate-limit middleware, `Retry-After` if present, and whether the interceptor retries this status.

Next: stop the retry loop first if the client caused the burst. Do not raise the limit as the default fix.

## 500 Internal Server Error

An exception escaped. The status alone does not say query, serializer, or null deref.

Evidence: the server stack or logged error name, and the line it points at.

Next: open that line. If there is no stack, say the cause is unconfirmed and ask for the log.

## 502 Bad Gateway

A proxy or gateway got an invalid response from the upstream. The Node process may be down, crashing, or returning a non-HTTP response.

Evidence: gateway error, process logs, the upstream URL in the proxy config.

Next: separate "app crashed" from "proxy targets the wrong port". Confirm with the process log.

## 503 Service Unavailable

The process is up and refusing traffic, or a dependency health check failed. Sometimes a deploy or a gateway timeout is mislabeled 503.

Evidence: health check, maintenance flag, dependency error in logs.

Next: name the dependency or flag. Do not treat 503 as a client bug.

## Network error, timeout, and CORS

These often have no HTTP status on the client.

- **Network error.** `error.request` is set and `error.response` is not. The host did not answer. Check base URL, device network, ATS or cleartext HTTP on mobile, and that the server is the one in this env's config.
- **Timeout.** The client `timeout` or a gateway limit fired before a status. Compare the two numbers in config. A slow query can look like a timeout. Confirm with the server log before blaming the client number.
- **CORS.** The browser blocked the response. Postman can still succeed. Evidence is the console CORS message and the server's `Access-Control-Allow-Origin`, methods, and `Access-Control-Allow-Headers` for the header the client actually sends (`Authorization`, tenant id). A proxy that only exists in dev explains "works in dev, fails on the deployed UI".
