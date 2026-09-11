import { notFound } from "next/navigation";
import { ReceiptView } from "@/components/ReceiptView";
import { ensureDemo, getReceipt } from "@/lib/store";
import { buildReceiptFromFixtures } from "@/lib/fixtures";

export const dynamic = "force-dynamic";

export default async function ReceiptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: raw } = await params;
  ensureDemo();
  let receipt = getReceipt(raw);
  if (!receipt && raw === "demo") {
    receipt = buildReceiptFromFixtures("pass");
  }
  if (!receipt && raw === "demo-fail") {
    receipt = buildReceiptFromFixtures("fail");
  }
  if (!receipt) notFound();

  return (
    <ReceiptView
      receipt={receipt}
      jsonHref={`/r/${receipt.receipt_id}.json`}
    />
  );
}
