# GHS env surfaces

Vite frontend, Node backend, Heroku config. Classify every env or credential change against these surfaces.

## Frontend build

`import.meta.env.VITE_*` in `client/`. Values are baked at heroku-postbuild / vite build. Saving a Heroku config var does not update them until the app is rebuilt and redeployed.

| Variable | Role |
|---|---|
| `VITE_APP_INSTANCE_URL` | Salesforce instance URL |
| `VITE_NODE_API_URL` | Node API base URL |
| `VITE_RAZORPAY_KEY_ID` | Razorpay key id for Checkout. If missing, `Payment.tsx` falls back to a test key |
| `VITE_APP_ENV` | App environment (`PROD` / `QA` selects the production token grant) |

## Backend runtime

`process.env.*` in `index.js`, `routes/`, and `razorpay.js`, read when Node starts.

| Variable | Role |
|---|---|
| `RAZORPAY_KEY_ID` | Razorpay key id |
| `RAZORPAY_KEY_SECRET` | Razorpay secret. Node only — never a `VITE_` copy |
| `VITE_APP_INSTANCE_URL` | Salesforce instance URL, also read by `routes/token.js` at runtime |
| `CLIENT_ID` | Client id |
| `CLIENT_SECRET` | Client secret. Node only — never a `VITE_` copy |
| `GRANT_TYPE` | Token grant type |
| `CORS_ORIGIN` | Allowed browser origin |
| `PORT` | Listen port |

`.env` is gitignored. Heroku Config Vars are the production source.

## Both

Same logical setting in client and server:

- Salesforce instance URL — `VITE_APP_INSTANCE_URL` (frontend build and `routes/token.js`)
- Razorpay key id — `RAZORPAY_KEY_ID` and `VITE_RAZORPAY_KEY_ID`

## Razorpay pairing

| Variable | Surface | Rule |
|---|---|---|
| `RAZORPAY_KEY_ID` | Node | Server key id |
| `RAZORPAY_KEY_SECRET` | Node only | Never a `VITE_` copy |
| `VITE_RAZORPAY_KEY_ID` | Frontend build | Same key id as `RAZORPAY_KEY_ID` |

The frontend cannot read `RAZORPAY_KEY_ID`. Checkout needs `VITE_RAZORPAY_KEY_ID` with the same key id.

Checkout mode follows the key prefix: `rzp_live_` vs `rzp_test_`. If the frontend prefix does not match the backend prefix, the verdict is Blocker.

Secrets (`*_SECRET`, passwords) must never get a `VITE_` copy.

## Token grant

Production token grant is `client_credentials` when `VITE_APP_ENV` is PROD / QA (`routes/token.js`).

## Not an env miss

- Empty Salesforce records (`[]`) are a data/org issue, not an env miss.
- Home Salesforce queries need a token. Empty records skip product APIs even if localStorage still shows categories.
- Local images with an empty API usually mean persisted localStorage (`categories-store`).
