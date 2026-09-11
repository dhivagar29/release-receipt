import { NextResponse } from "next/server";
import { ensureDemo, getReceipt } from "@/lib/store";
import { buildReceiptFromFixtures } from "@/lib/fixtures";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  ensureDemo();
  let receipt = getReceipt(id);
  if (!receipt && id === "demo") receipt = buildReceiptFromFixtures("pass");
  if (!receipt && id === "demo-fail") receipt = buildReceiptFromFixtures("fail");
  if (!receipt) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json(receipt, {
    headers: { "Cache-Control": "no-store" },
  });
}
