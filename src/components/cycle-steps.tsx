type CycleStep = {
  title: string;
  text: string;
};

type CycleStepsProps = {
  steps: CycleStep[];
};

export function CycleSteps({ steps }: CycleStepsProps) {
  return (
    <div>
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, index) => (
          <li key={step.title} className="rounded-card border border-line bg-bg p-6">
            <div className="font-heading text-sm font-bold text-accent">
              {String(index + 1).padStart(2, "0")}
            </div>
            <h3 className="mt-2 font-heading text-lg font-bold">{step.title}</h3>
            <p className="mt-2 text-ink-muted">{step.text}</p>
          </li>
        ))}
      </ol>
      <p className="mt-6 flex items-center gap-3 font-semibold text-accent">
        <span aria-hidden="true">↻</span>
        После пересмотра цикл начинается заново, уже с вашим опытом.
      </p>
    </div>
  );
}
