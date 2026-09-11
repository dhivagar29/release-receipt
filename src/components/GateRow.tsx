import type { GateResult } from "@/lib/types";
import { StatusPill } from "./StatusPill";

export function GateRow({ gate }: { gate: GateResult }) {
  return (
    <div className="flex flex-col gap-1 border-b border-edge/80 px-4 py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-snow">{gate.tool}</span>
          <span className="font-mono text-xs text-fog">{gate.id}</span>
          {!gate.required && (
            <span className="rounded bg-panel-2 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-fog">
              optional
            </span>
          )}
        </div>
        <p className="mt-0.5 text-sm text-mist/90">{gate.summary}</p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {gate.evidence_uri ? (
          <a
            href={gate.evidence_uri}
            className="text-xs text-cyan hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            evidence
          </a>
        ) : null}
        <StatusPill status={gate.status} />
      </div>
    </div>
  );
}
