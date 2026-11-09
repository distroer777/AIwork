type Allocation = {
  label: string;
  percent: number;
};

type PortfolioWidgetProps = {
  capital: string;
  today: string;
  total: string;
  allocation: Allocation[];
};

export function PortfolioWidget({ capital, today, total, allocation }: PortfolioWidgetProps) {
  return (
    <div className="rounded-card border border-line bg-surface p-6 shadow-card sm:p-8">
      <p className="text-sm text-ink-muted">Виртуальный капитал</p>
      <div className="mt-1 font-heading text-3xl font-bold">{capital}</div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-ink-muted">Сегодня</p>
          <p className="font-heading text-xl font-bold text-success">{today}</p>
        </div>
        <div>
          <p className="text-sm text-ink-muted">За всё время</p>
          <p className="font-heading text-xl font-bold text-success">{total}</p>
        </div>
      </div>
      <ul className="mt-6 flex flex-col gap-4">
        {allocation.map((item) => (
          <li key={item.label}>
            <div className="mb-1 flex justify-between text-sm">
              <span>{item.label}</span>
              <span className="font-semibold">{item.percent}%</span>
            </div>
            <div className="h-2 rounded-pill bg-accent-soft">
              <div className="h-2 rounded-pill bg-accent" style={{ width: `${item.percent}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
