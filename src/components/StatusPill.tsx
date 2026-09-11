import type { GateStatus } from "@/lib/types";

const STYLES: Record<GateStatus, string> = {
  pass: "bg-mint/15 text-mint ring-mint/30",
  fail: "bg-rose/15 text-rose ring-rose/30",
  warn: "bg-amber/15 text-amber ring-amber/30",
  skipped: "bg-fog/10 text-fog ring-fog/20",
};

export function StatusPill({ status }: { status: GateStatus }) {
  return (
    <span
      className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold uppercase tracking-wider ring-1 ${STYLES[status]}`}
    >
      {status}
    </span>
  );
}
