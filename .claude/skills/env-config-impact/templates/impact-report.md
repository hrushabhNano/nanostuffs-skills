# Env config impact — {Name}

## Change
| | |
|---|---|
| **Name** | |
| **Value kind** | url / public key id / secret / grant type |
| **Where** | local `.env` / `client/.env` / Heroku |
| **Value** | live secret (set) / missing / non-secret summary |

## Intent
{What this change is for. Names only.}

## Surfaces
| Surface | Hit | Evidence |
|---|---|---|
| Frontend build | Yes / No | |
| Node runtime | Yes / No | |
| Heroku config | Yes / No | |

## Pairing
| Must also exist | Same value as | Why |
|---|---|---|
| | | |

## Verdict
Safe for backend only / Needs frontend rebuild / Blocker

{One sentence.}

## Local vs production
| | Local | Production |
|---|---|---|
| Source | `.env` / `client/.env` | Heroku Config Vars |
| This change | | |

## How to verify
- **Network:**
- **Checkout key prefix:** `rzp_test_` / `rzp_live_` (prefix only)
- **Heroku config:** names only

## Open items
- 
