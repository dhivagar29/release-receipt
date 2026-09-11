export type GateStatus = "pass" | "fail" | "warn" | "skipped";

export type GateId =
  | "actions_workflow"
  | "snyk_sca"
  | "sonar_qg"
  | "jfrog_artifact"
  | "ghas_codeql"
  | "ghas_secret_scanning"
  | "ghas_dependabot"
  | "vault_lease"
  | "aws_deploy"
  | "dynatrace_slo";

export interface GateResult {
  id: GateId;
  tool: string;
  status: GateStatus;
  summary: string;
  evidence_uri: string | null;
  required: boolean;
}

export interface ArtifactInfo {
  name: string;
  version: string;
  uri: string | null;
  checksum: string | null;
}

/**
 * Stable receipt schema — do not churn.
 * receipt_id, git_sha, build_id, artifact{name,version,uri,checksum},
 * gates[{id,tool,status,summary,evidence_uri}], overall.
 */
export interface Receipt {
  receipt_id: string;
  git_sha: string;
  build_id: string;
  artifact: ArtifactInfo;
  gates: GateResult[];
  overall: "PASS" | "FAIL";
  // Supplemental context (additive; never replaces the fields above)
  repo: string;
  ref: string;
  run_id: string;
  created_at: string;
  scenario?: Scenario;
}

export interface FixtureMeta {
  receipt_id: string;
  git_sha: string;
  ref: string;
  repo: string;
  build_id: string;
  run_id: string;
  created_at: string;
  artifact: ArtifactInfo;
}

export type Scenario = "pass" | "fail";
