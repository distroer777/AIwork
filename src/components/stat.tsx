type StatProps = {
  value: string;
  label: string;
};

export function Stat({ value, label }: StatProps) {
  return (
    <div className="rounded-card border border-line bg-surface p-5">
      <div className="font-heading text-2xl font-bold text-accent sm:text-3xl">{value}</div>
      <div className="mt-1 text-sm text-ink-muted">{label}</div>
    </div>
  );
}
