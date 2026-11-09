type StoryCardProps = {
  before: string;
  after: string;
};

export function StoryCard({ before, after }: StoryCardProps) {
  return (
    <div className="flex flex-col gap-5 rounded-card border border-line bg-surface p-6 shadow-card">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-ink-muted">Было</p>
        <p className="mt-1">{before}</p>
      </div>
      <div className="border-t border-line pt-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-accent">Стало</p>
        <p className="mt-1 font-semibold">{after}</p>
      </div>
    </div>
  );
}
