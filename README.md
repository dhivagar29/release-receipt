# Release Receipt

**Shareable HTML/JSON evidence receipt for a single release SHA.**  
Pilot gates fail closed on **GitHub Advanced Security** (CodeQL, secret scanning, Dependabot), **Snyk** (SCA vendor), and **SonarQube** quality gate.

MIT licensed. Fixtures-only demo — no live vendor APIs, no client data, no secret values.

## Why

Change tickets need a single artifact that answers: *did this SHA clear the scanners we agreed on?* Release Receipt merges those findings into one PASS/FAIL receipt you can link or export as JSON.

## Pilot gates (fail-closed)

| Gate | Tool | Fail rule |
| --- | --- | --- |
| `ghas_codeql` | CodeQL | any **critical** |
| `ghas_secret_scanning` | Secret scanning | any **open alert** at build SHA |
| `ghas_dependabot` | Dependabot (GitHub native) | **critical** → fail; **high** → **warn** (documented) |
| `snyk_sca` | Snyk (SCA vendor) | any **critical** |
| `sonar_qg` | SonarQube | quality gate **ERROR** |

Overall is **FAIL** if any required gate is `fail`. Dependabot `warn` (high only) does **not** fail overall. Snyk OR Dependabot critical → overall fail.

**UI:** one “GitHub Advanced Security” section with three rows; Snyk and Sonar stay separate.

**Not in pilot UI:** JFrog, Vault, AWS, Dynatrace (deferred). GitHub Actions appears only as an optional thin orchestrator/publisher row — not a scanner gate.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) → **Demo PASS** / **Demo WARN** / **Demo FAIL**, or **Generate from fixtures**.

```bash
npm run build
```

## Routes

| Method | Path | Description |
| --- | --- | --- |
| GET | `/` | Landing |
| GET | `/demo` | PASS demo (`?scenario=warn` / `fail`) |
| GET | `/r/:id` | Receipt HTML |
| GET | `/r/:id.json` | Receipt JSON export |
| POST | `/api/receipts/from-fixtures` | Body `{ "scenario": "pass" \| "fail" \| "warn" }` (unknown → **400**) |
| GET | `/api/receipts/:id` | Receipt JSON |

APIs send `Cache-Control: no-store`. App sets CSP-ish security headers.

## Receipt schema

```json
{
  "receipt_id": "rr-demo-pass-001",
  "created_at": "2026-09-11T10:00:00.000Z",
  "git_sha": "…",
  "ref": "refs/heads/main",
  "repo": "acme/payments-api",
  "build_id": "run-88421",
  "run_id": "88421",
  "artifact": { "name": "…", "version": "…", "uri": "…", "checksum": "…" },
  "gates": [
    { "id": "ghas_codeql", "tool": "codeql", "status": "pass", "summary": "…", "evidence_uri": "…", "required": true }
  ],
  "overall": "PASS"
}
```

## Fixtures

- `fixtures/receipts/sample-1/` — PASS pack
- `fixtures/receipts/sample-warn/` — PASS overall with Dependabot **high→warn** (proves warn ≠ fail)
- `fixtures/receipts/sample-fail/` — FAIL pack

Artifact `uri` in meta may point at an example Artifactory URL; that is metadata only — **not** a JFrog gate in the pilot UI.

**Auth required before any live vendor integrations.** This pilot is fixtures-only until authenticated integrations are wired.

See [docs/RUNBOOK.md](docs/RUNBOOK.md).

## License

MIT
