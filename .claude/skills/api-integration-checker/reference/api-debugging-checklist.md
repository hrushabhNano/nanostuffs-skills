# API debugging checklist

Use this while tracing. Each item is a question and the evidence to open. Skip items that cannot produce the symptom you are looking at.

## Request trace

- Where does the call start? Open the component or hook that handles the click, submit, or effect, then the function it calls.
- Which service function builds the request? Open that module and the Axios call inside it.
- What URL does the running code request, after the base URL and path are joined? Compare that string with the route registered on the server.

## URL and HTTP method

- Is the path prefixed twice (`/api` on the client and `/api` on the route, or a base URL that already ends in `/api`)?
- Do the client method and the route method match (`GET` vs `POST`, `PUT` vs `PATCH`)?
- Is the route mounted on the router the server actually listens with? A handler in an unmounted file is not a route.

## Axios instance and interceptors

- Which instance is used: a shared client or a one-off `axios.get`? Read the instance file for `baseURL`, `timeout`, `paramsSerializer`, and `withCredentials`.
- Does a request interceptor attach `Authorization`, `Content-Type`, or a tenant header? Does it return the config, or drop it?
- Does a response interceptor treat some 2xx bodies as errors, or swallow the real status and throw a generic message?
- Is the error the caller sees `error.response`, `error.request` (no response), or a setup error? Those are different failures.

## Authentication and authorization

- Is a token read from memory, secure storage, or a cookie, and is it attached on this call?
- Is the header shape what the server reads (`Bearer <token>` vs a raw token vs a cookie name)?
- Does the server reject the signature, the expiry, or the audience? That is authentication (401).
- Does the server accept the identity and then reject the role, tenant, or resource? That is authorization (403). Do not swap those labels without the check in code.

## Request payload

- List the fields the client sends and the fields the validation schema requires. Compare names, nesting, types, and formats (string id vs number, `userId` vs `user_id`, dates).
- Are optional fields sent as `null` or `""` when the schema rejects those?
- Is the body actually JSON? Check `Content-Type` and whether the client is sending `FormData` or a stringified string.

## Response parsing and mapping

- What shape does the handler return (`{ data: T }`, a bare array, `{ items, page }`)?
- What shape does the UI read? A 200 with data at `response.data.items` while the component maps `response.data` shows an empty screen.
- Are null and empty array handled differently? Does pagination stop because `page` is 1-based on one side and 0-based on the other?

## CORS, proxy, and network

- Does the browser console say CORS, or does the Axios error have no `response`? A CORS failure is a browser block. Postman will not show it.
- Is there a dev proxy (`proxy` in package.json, Vite `server.proxy`, webpack devServer, Metro)? Does it forward the path the client uses, including `/api`?
- What is `timeout` on the client, and does the server or gateway time out sooner?

## Backend route and middleware

- Walk middleware in order: body parser, auth, tenant, validation, handler. The first one that sends a status is the one to cite.
- Does the handler run, or does a wrapper return before it? Log lines or a thrown error in a specific middleware decide this. Do not assume the handler ran.
- Is the status set explicitly, or produced by a default error handler? Read that handler before describing the body.

## Database and serialization

- Does the failing path query with a user-supplied id that does not match the column type or the tenant filter?
- Does the serializer rename or drop fields the client requires?
- A 500 after a query is not automatically a bad query. Read the stack or the logged error code first.

## Environment

- Which env is this run: local, UAT, or production? Compare the base URL, audience, and feature flags used in that mode.
- Are client and server pointed at the same environment? A local UI against a UAT API is a config finding only if both values are in the files or the logs.

## Retries and double submits

- Does the interceptor or the caller retry on this status? A retry on 401 or 400 can look like a loop.
- Can the button fire twice before the first request settles? Check the disabled state and any request id or idempotency key.

## Regression tests

- Is there already a test for this service function, route, or schema? Read it before adding another.
- The new test should fail on the mismatch you found (wrong prefix, wrong field, missing header, wrong response path) and pass after the smallest fix.
