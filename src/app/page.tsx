import Link from "next/link";
import { GenerateButton } from "@/components/GenerateButton";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <section className="space-y-5 text-center sm:text-left">
        <p className="text-xs uppercase tracking-[0.25em] text-cyan">
          ReleaseGate · Pilot
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-snow sm:text-5xl">
          One shareable receipt.
          <span className="block text-cyan">Fail closed when it matters.</span>
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-mist">
          <strong className="text-snow">Release Receipt</strong> merges findings
          for a single git SHA into an HTML + JSON artifact you can paste into a
          change ticket. Pilot gates:{" "}
          <span className="text-snow">GitHub Advanced Security</span> (CodeQL,
          secret scanning, Dependabot), <span className="text-snow">Snyk</span>{" "}
          (SCA vendor), and <span className="text-snow">SonarQube</span> quality
          gate. Any required red → overall <span className="text-rose">FAIL</span>.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
          <Link
            href="/demo"
            className="rounded-lg bg-snow px-4 py-2 text-sm font-semibold text-ink hover:bg-mist"
          >
            View demo PASS
          </Link>
          <Link
            href="/demo?scenario=fail"
            className="rounded-lg bg-panel-2 px-4 py-2 text-sm font-semibold text-snow ring-1 ring-edge hover:bg-edge/50"
          >
            View demo FAIL
          </Link>
          <GenerateButton scenario="pass" />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Card
          title="GHAS · this SHA"
          body="CodeQL critical→fail. Secrets open-at-SHA→fail. Dependabot critical→fail, high→warn."
        />
        <Card
          title="Snyk · SCA vendor"
          body="Critical findings fail the receipt. Complements Dependabot (GitHub native)."
        />
        <Card
          title="Sonar QG"
          body="Quality gate ERROR fails closed. Coverage and ratings shown in summary."
        />
      </section>

      <section className="rounded-2xl border border-edge bg-panel p-6 text-sm text-mist">
        <h2 className="text-base font-semibold text-snow">Pilot scope</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          <li>Required fail-closed: GHAS (3 rows) + Snyk + Sonar only.</li>
          <li>Actions is an optional orchestrator/publisher row — not a scanner gate.</li>
          <li>Deferred (not in pilot UI): JFrog, Vault, AWS, Dynatrace.</li>
          <li>Fixtures only — no live vendor APIs, no client data, no secrets.</li>
        </ul>
      </section>
    </div>
  );
}

function Card({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-edge bg-panel p-4">
      <h3 className="text-sm font-semibold text-snow">{title}</h3>
      <p className="mt-2 text-sm text-fog">{body}</p>
    </div>
  );
}
