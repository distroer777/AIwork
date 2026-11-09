type LogicCardProps = {
  title: string;
  items: string[];
  variant: "without" | "with";
};

export function LogicCard({ title, items, variant }: LogicCardProps) {
  const isWith = variant === "with";
  return (
    <div
      className={`rounded-card border p-6 text-ink sm:p-8 ${
        isWith ? "border-accent bg-accent-soft" : "border-line bg-surface"
      }`}
    >
      <h3 className="font-heading text-xl font-bold">{title}</h3>
      <ul className="mt-5 flex flex-col gap-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span
              className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-pill text-sm font-bold ${
                isWith ? "bg-accent text-on-accent" : "bg-line text-ink-muted"
              }`}
              aria-hidden="true"
            >
              {isWith ? "✓" : "×"}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
