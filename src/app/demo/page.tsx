import { ReceiptView } from "@/components/ReceiptView";
import { GenerateButton } from "@/components/GenerateButton";
import { buildReceiptFromFixtures } from "@/lib/fixtures";
import type { Scenario } from "@/lib/types";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DemoPage({
  searchParams,
}: {
  searchParams: Promise<{ scenario?: string }>;
}) {
  const sp = await searchParams;
  const scenario: Scenario = sp.scenario === "fail" ? "fail" : "pass";
  const receipt = buildReceiptFromFixtures(scenario);
  const id = scenario === "fail" ? "demo-fail" : "demo";

  return (
    <div className="space-y-6">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-fog">
          Fixture scenario:{" "}
          <span className="font-mono text-snow">{scenario}</span>
          <span className="mx-2">·</span>
          <Link
            href={scenario === "pass" ? "/demo?scenario=fail" : "/demo"}
            className="text-cyan hover:underline"
          >
            switch to {scenario === "pass" ? "fail" : "pass"}
          </Link>
        </div>
        <GenerateButton scenario={scenario} />
      </div>
      <ReceiptView receipt={receipt} jsonHref={`/r/${id}.json`} />
    </div>
  );
}
