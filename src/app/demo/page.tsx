import { ReceiptView } from "@/components/ReceiptView";
import { GenerateButton } from "@/components/GenerateButton";
import { buildReceiptFromFixtures, parseScenario, SCENARIOS } from "@/lib/fixtures";
import type { Scenario } from "@/lib/types";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const DEMO_IDS: Record<Scenario, string> = {
  pass: "demo",
  fail: "demo-fail",
  warn: "demo-warn",
};

export default async function DemoPage({
  searchParams,
}: {
  searchParams: Promise<{ scenario?: string }>;
}) {
  const sp = await searchParams;
  const scenario = parseScenario(sp.scenario);
  if (scenario === null) notFound();

  const receipt = buildReceiptFromFixtures(scenario);
  const id = DEMO_IDS[scenario];

  const others = SCENARIOS.filter((s) => s !== scenario);

  return (
    <div className="space-y-6">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-fog">
          Fixture scenario:{" "}
          <span className="font-mono text-snow">{scenario}</span>
          <span className="mx-2">·</span>
          {others.map((s, i) => (
            <span key={s}>
              {i > 0 ? <span className="mx-2 text-edge">·</span> : null}
              <Link
                href={s === "pass" ? "/demo" : `/demo?scenario=${s}`}
                className="text-cyan hover:underline"
              >
                {s}
              </Link>
            </span>
          ))}
        </div>
        <GenerateButton scenario={scenario} />
      </div>
      <ReceiptView receipt={receipt} jsonHref={`/r/${id}.json`} />
    </div>
  );
}
