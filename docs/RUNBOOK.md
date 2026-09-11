# Release Receipt — Runbook (pilot)

## Local

```bash
npm install
npm run dev    # http://localhost:3000
npm run build && npm start
```

## Demo

| Route | Purpose |
| --- | --- |
| `/` | Landing |
| `/demo` | PASS fixture receipt |
| `/demo?scenario=warn` | PASS overall + Dependabot high→warn |
| `/demo?scenario=fail` | FAIL fixture receipt |
| `/r/:id` | HTML receipt viewer |
| `/r/:id.json` | JSON export |
| `POST /api/receipts/from-fixtures` | Generate receipt (`{"scenario":"pass"|"fail"|"warn"}`; unknown → 400) |
| `GET /api/receipts/:id` | Fetch receipt JSON |

## Fail-closed rules (pilot)

Required (any `fail` → overall **FAIL**):

- `ghas_codeql` — any **critical** → fail
- `ghas_secret_scanning` — any open alert at build SHA → fail
- `ghas_dependabot` — **critical** → fail; **high** → warn (warn does not fail overall)
- `snyk_sca` — any **critical** → fail
- `sonar_qg` — quality gate `ERROR` → fail

Snyk and Dependabot overlap: either failing fails overall.

Optional (not fail-closed):

- `actions_workflow` — thin orchestrator/publisher row only

Deferred (not in pilot UI): JFrog, Vault, AWS, Dynatrace.

## Fixtures

- `fixtures/receipts/sample-1/` — all required gates green
- `fixtures/receipts/sample-warn/` — Dependabot high>0 only → overall PASS with warn row
- `fixtures/receipts/sample-fail/` — required gates red

Demo data only — no live vendor APIs, no client secrets.
Auth required before any live vendor integrations.
