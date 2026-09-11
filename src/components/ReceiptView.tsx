import type { Receipt } from "@/lib/types";
import { GateRow } from "./GateRow";
import { OverallBadge } from "./OverallBadge";

const GHAS_IDS = new Set([
  "ghas_codeql",
  "ghas_secret_scanning",
  "ghas_dependabot",
]);

function shortSha(sha: string) {
  return sha.slice(0, 12);
}

export function ReceiptView({
  receipt,
  jsonHref,
}: {
  receipt: Receipt;
  jsonHref: string;
}) {
  const ghas = receipt.gates.filter((g) => GHAS_IDS.has(g.id));
  const others = receipt.gates.filter((g) => !GHAS_IDS.has(g.id));
  const required = others.filter((g) => g.required);
  const optional = others.filter((g) => !g.required);

  return (
    <article className="mx-auto w-full max-w-3xl space-y-6">
      <header className="rounded-2xl border border-edge bg-panel p-6 shadow-xl shadow-black/40">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-fog">
              Release Receipt
            </p>
            <h1 className="mt-1 font-mono text-xl text-snow sm:text-2xl">
              {receipt.receipt_id}
            </h1>
            <p className="mt-2 text-sm text-mist">
              <span className="text-fog">{receipt.repo}</span>
              <span className="mx-2 text-edge">·</span>
              <span className="font-mono text-cyan">{shortSha(receipt.git_sha)}</span>
              <span className="mx-2 text-edge">·</span>
              <span className="font-mono text-fog">{receipt.ref}</span>
            </p>
          </div>
          <OverallBadge overall={receipt.overall} />
        </div>
        <dl className="mt-5 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <Meta label="Build" value={receipt.build_id} />
          <Meta label="Run" value={receipt.run_id} />
          <Meta
            label="Artifact"
            value={`${receipt.artifact.name}@${receipt.artifact.version}`}
          />
          <Meta
            label="Created"
            value={new Date(receipt.created_at).toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
            })}
          />
        </dl>
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href={jsonHref}
            className="rounded-lg bg-panel-2 px-3 py-1.5 text-xs font-medium text-snow ring-1 ring-edge hover:bg-edge/40"
          >
            Export JSON
          </a>
        </div>
      </header>

      <Section title="GitHub Advanced Security" subtitle="Findings for this SHA">
        {ghas.map((g) => (
          <GateRow key={g.id} gate={g} />
        ))}
      </Section>

      <Section title="SCA & Quality" subtitle="Vendor scanners (fail-closed)">
        {required.map((g) => (
          <GateRow key={g.id} gate={g} />
        ))}
      </Section>

      {optional.length > 0 ? (
        <Section
          title="Pipeline"
          subtitle="Orchestrator only — does not fail-close"
        >
          {optional.map((g) => (
            <GateRow key={g.id} gate={g} />
          ))}
        </Section>
      ) : null}

      <p className="text-center text-xs text-fog">
        Fail-closed on GHAS (CodeQL / secrets / Dependabot) + Snyk + Sonar.
        Dependabot: critical → fail, high → warn. Demo fixtures only.
      </p>
    </article>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-panel-2/80 px-3 py-2 ring-1 ring-edge/60">
      <dt className="text-[10px] uppercase tracking-wider text-fog">{label}</dt>
      <dd className="mt-0.5 truncate font-mono text-xs text-mist">{value}</dd>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-edge bg-panel">
      <div className="border-b border-edge px-4 py-3">
        <h2 className="text-sm font-semibold text-snow">{title}</h2>
        <p className="text-xs text-fog">{subtitle}</p>
      </div>
      <div>{children}</div>
    </section>
  );
}
