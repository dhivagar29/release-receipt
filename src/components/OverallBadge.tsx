export function OverallBadge({ overall }: { overall: "PASS" | "FAIL" }) {
  const pass = overall === "PASS";
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold tracking-wide ${
        pass
          ? "bg-mint/15 text-mint ring-1 ring-mint/40"
          : "bg-rose/15 text-rose ring-1 ring-rose/40"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${pass ? "bg-mint" : "bg-rose"}`}
        aria-hidden
      />
      {overall}
    </span>
  );
}
