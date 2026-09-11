import { NextResponse } from "next/server";
import { generateFromFixtures } from "@/lib/store";
import type { Scenario } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let scenario: Scenario = "pass";
  try {
    const body = (await req.json()) as { scenario?: string };
    if (body?.scenario === "fail") scenario = "fail";
  } catch {
    // empty body → pass
  }
  const receipt = generateFromFixtures(scenario);
  return NextResponse.json(receipt, {
    status: 201,
    headers: { "Cache-Control": "no-store" },
  });
}
