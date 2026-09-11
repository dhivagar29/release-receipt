import { readFileSync, existsSync } from "fs";
import path from "path";
import type { FixtureMeta, Scenario } from "./types";
import {
  evaluateActions,
  evaluateCodeql,
  evaluateDependabot,
  evaluateSecrets,
  evaluateSnyk,
  evaluateSonar,
  rollupOverall,
} from "./evaluate";
import type { Receipt } from "./types";

const PACK: Record<Scenario, string> = {
  pass: "sample-1",
  fail: "sample-fail",
};

function fixturesRoot() {
  return path.join(process.cwd(), "fixtures", "receipts");
}

function loadJson<T>(pack: string, file: string): T {
  const p = path.join(fixturesRoot(), pack, file);
  if (!existsSync(p)) {
    throw new Error(`Missing fixture: ${pack}/${file}`);
  }
  return JSON.parse(readFileSync(p, "utf8")) as T;
}

export function listScenarios(): Scenario[] {
  return ["pass", "fail"];
}

export function buildReceiptFromFixtures(scenario: Scenario = "pass"): Receipt {
  const pack = PACK[scenario] ?? PACK.pass;
  const meta = loadJson<FixtureMeta>(pack, "meta.json");
  const codeql = loadJson(pack, "ghas_codeql.json");
  const secrets = loadJson(pack, "ghas_secrets.json");
  const dependabot = loadJson(pack, "ghas_dependabot.json");
  const snyk = loadJson(pack, "snyk.json");
  const sonar = loadJson(pack, "sonar.json");
  let actions = null;
  try {
    actions = loadJson(pack, "actions.json");
  } catch {
    actions = null;
  }

  const gates = [
    evaluateCodeql(codeql as never),
    evaluateSecrets(secrets as never),
    evaluateDependabot(dependabot as never),
    evaluateSnyk(snyk as never),
    evaluateSonar(sonar as never),
  ];
  const actionsGate = evaluateActions(actions as never);
  if (actionsGate) gates.push(actionsGate);

  const overall = rollupOverall(gates);

  return {
    receipt_id: meta.receipt_id,
    created_at: meta.created_at,
    git_sha: meta.git_sha,
    ref: meta.ref,
    repo: meta.repo,
    build_id: meta.build_id,
    run_id: meta.run_id,
    artifact: meta.artifact,
    gates,
    overall,
  };
}
