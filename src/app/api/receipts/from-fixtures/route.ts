import { NextResponse } from "next/server";
import { parseScenario } from "@/lib/fixtures";
import { generateFromFixtures } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let raw: string | undefined;
  try {
    const body = (await req.json()) as { scenario?: string };
    raw = body?.scenario;
  } catch {
    // empty body → default pass via parseScenario(undefined)
  }
  const scenario = parseScenario(raw);
  if (scenario === null) {
    return NextResponse.json(
      {
        error: "unknown scenario",
        allowed: ["pass", "fail", "warn"],
      },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }
  const receipt = generateFromFixtures(scenario);
  return NextResponse.json(receipt, {
    status: 201,
    headers: { "Cache-Control": "no-store" },
  });
}
