type UsageBarProps = {
  used: number;
  limit: number;
  label: string;
};

/** Полоса использования. Когда лимит исчерпан, она красная. */
export function UsageBar({ used, limit, label }: UsageBarProps) {
  const exhausted = used >= limit;
  const percent = Math.min(100, Math.round((used / limit) * 100));
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="text-ink-muted">{label}</span>
        <span className="font-semibold">
          {Math.min(used, limit)}/{limit}
        </span>
      </div>
      <div
        className="mt-1.5 h-2 overflow-hidden rounded-pill bg-line"
        role="progressbar"
        aria-valuenow={Math.min(used, limit)}
        aria-valuemin={0}
        aria-valuemax={limit}
        aria-label={label}
      >
        <div className={`h-full rounded-pill ${exhausted ? "bg-danger" : "bg-accent"}`} style={{ width: `${percent}%` }} />
      </div>
      {exhausted ? <p className="mt-1.5 text-sm font-semibold text-danger">Лимит исчерпан</p> : null}
    </div>
  );
}
