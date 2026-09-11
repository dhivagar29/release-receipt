"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function GenerateButton({
  scenario = "pass",
}: {
  scenario?: "pass" | "fail";
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onClick() {
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/receipts/from-fixtures", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ scenario }),
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { receipt_id: string };
      router.push(`/r/${data.receipt_id}`);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "failed");
      setBusy(false);
    }
  }

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={onClick}
        disabled={busy}
        className="rounded-lg bg-cyan px-4 py-2 text-sm font-semibold text-ink hover:bg-cyan/90 disabled:opacity-60"
      >
        {busy ? "Generating…" : `Generate ${scenario} receipt`}
      </button>
      {err ? <span className="text-xs text-rose">{err}</span> : null}
    </div>
  );
}
