import type { GateResult } from "./types";

interface CodeqlFixture {
  tool?: string;
  commit?: string;
  rule_count_by_severity: Record<string, number>;
  blocking?: "critical" | "high";
  status?: string;
  evidence_uri?: string;
}

interface SecretsFixture {
  open_alerts: number;
  push_protection_blocked?: boolean;
  evidence_uri?: string;
}

interface DependabotFixture {
  critical: number;
  high: number;
  medium: number;
  low: number;
  evidence_uri?: string;
}

interface SnykFixture {
  critical: number;
  high?: number;
  medium?: number;
  low?: number;
  evidence_uri?: string;
  label?: string;
}

interface SonarFixture {
  qualityGate: { status: string; conditions?: unknown[] };
  evidence_uri?: string;
  projectKey?: string;
}

interface ActionsFixture {
  role?: string;
  workflow?: string;
  run_id?: string;
  conclusion?: string;
  html_url?: string;
}

export function evaluateCodeql(f: CodeqlFixture): GateResult {
  const counts = f.rule_count_by_severity ?? {};
  const critical = counts.critical ?? 0;
  const high = counts.high ?? 0;
  const blocking = f.blocking ?? "critical";
  const fail =
    blocking === "high" ? critical + high > 0 : critical > 0;
  return {
    id: "ghas_codeql",
    tool: "codeql",
    status: fail ? "fail" : "pass",
    summary: fail
      ? `CodeQL: ${critical} critical, ${high} high (blocking=${blocking})`
      : `CodeQL clean for blocking=${blocking} (${critical} crit / ${high} high)`,
    evidence_uri: f.evidence_uri ?? null,
    required: true,
  };
}

export function evaluateSecrets(f: SecretsFixture): GateResult {
  const open = f.open_alerts ?? 0;
  const blocked = Boolean(f.push_protection_blocked);
  const fail = open > 0;
  return {
    id: "ghas_secret_scanning",
    tool: "secret_scanning",
    status: fail ? "fail" : "pass",
    summary: fail
      ? `Secret scanning: ${open} open alert(s) at build SHA${blocked ? "; push protection blocked" : ""}`
      : `No open secret alerts at build SHA${blocked ? " (push protection idle)" : ""}`,
    evidence_uri: f.evidence_uri ?? null,
    required: true,
  };
}

export function evaluateDependabot(f: DependabotFixture): GateResult {
  const critical = f.critical ?? 0;
  const high = f.high ?? 0;
  let status: GateResult["status"] = "pass";
  if (critical > 0) status = "fail";
  else if (high > 0) status = "warn";
  return {
    id: "ghas_dependabot",
    tool: "dependabot",
    status,
    summary:
      status === "fail"
        ? `Dependabot (GitHub native): ${critical} critical → fail (${high} high)`
        : status === "warn"
          ? `Dependabot (GitHub native): ${high} high → warn (0 critical)`
          : `Dependabot (GitHub native): no critical/high (${f.medium ?? 0} med / ${f.low ?? 0} low)`,
    evidence_uri: f.evidence_uri ?? null,
    required: true,
  };
}

export function evaluateSnyk(f: SnykFixture): GateResult {
  const critical = f.critical ?? 0;
  const high = f.high ?? 0;
  const fail = critical > 0;
  return {
    id: "snyk_sca",
    tool: "snyk",
    status: fail ? "fail" : "pass",
    summary: fail
      ? `Snyk (SCA vendor): ${critical} critical → fail (${high} high)`
      : `Snyk (SCA vendor): 0 critical (${high} high / ${f.medium ?? 0} med)`,
    evidence_uri: f.evidence_uri ?? null,
    required: true,
  };
}

export function evaluateSonar(f: SonarFixture): GateResult {
  const qg = (f.qualityGate?.status ?? "ERROR").toUpperCase();
  const fail = qg === "ERROR";
  return {
    id: "sonar_qg",
    tool: "sonarqube",
    status: fail ? "fail" : "pass",
    summary: fail
      ? `SonarQube quality gate ERROR`
      : `SonarQube quality gate ${qg}`,
    evidence_uri: f.evidence_uri ?? null,
    required: true,
  };
}

/** Thin orchestrator row — not a scanner gate; does not fail-close overall. */
export function evaluateActions(f: ActionsFixture | null): GateResult | null {
  if (!f) return null;
  const ok = (f.conclusion ?? "").toLowerCase() === "success";
  return {
    id: "actions_workflow",
    tool: "github_actions",
    status: ok ? "pass" : "warn",
    summary: `Actions orchestrator: ${f.workflow ?? "workflow"} run ${f.run_id ?? "?"} → ${f.conclusion ?? "unknown"}`,
    evidence_uri: f.html_url ?? null,
    required: false,
  };
}

/** Fail-closed on required gates only. Warn on required does not fail (Dependabot high→warn). */
export function rollupOverall(gates: GateResult[]): "PASS" | "FAIL" {
  const requiredFailed = gates.some((g) => g.required && g.status === "fail");
  return requiredFailed ? "FAIL" : "PASS";
}
