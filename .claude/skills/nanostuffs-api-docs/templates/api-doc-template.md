# {Service name} API

| | |
|---|---|
| **Base URL** | `{https://api.example.com/api/v1}` · local: `http://localhost:{PORT}/{prefix}` |
| **Format** | JSON (`Content-Type: application/json`) |
| **Auth** | {e.g. Bearer JWT in the `Authorization` header} |
| **Source** | `{repo} @ {branch / commit}` |

## Overview
{Two or three sentences: what this API serves and which apps call it.}

## Authentication
{Which endpoint issues the token, where to send it, expiry and refresh, roles.}

## Conventions
- **Success shape:** {e.g. `{ "success": true, "data": … }`}
- **Error shape:** {as returned by the central error handler}
- **Pagination:** {query params and response metadata, or "none"}
- **Dates and IDs:** {e.g. ISO 8601 UTC; MongoDB ObjectId}

## Endpoint index
| Method | Path | Auth | Summary |
|---|---|---|---|

---

## {Resource}

### {METHOD} `{/full/path}`
{One-line description.}

**Auth:** {Public / Bearer JWT / role: admin}  
**Source:** `{file}:{line}`

**Parameters**
| Name | In | Type | Required | Description |
|---|---|---|---|---|

**Request body**
| Field | Type | Required | Rules / description |
|---|---|---|---|

```json
{request example}
```

**Responses**
| Status | When | Body |
|---|---|---|
| 200 | | |

```json
{success response example}
```

---

## Not documented
- {METHOD path — reason, e.g. debug only, dynamic path}

## Notes for the backend team
- {Inconsistencies, possible bugs, missing validation}

## To confirm
- 
