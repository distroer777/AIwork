import type { ReactNode } from "react";

type FaqItemProps = {
  question: string;
  children: ReactNode;
};

export function FaqItem({ question, children }: FaqItemProps) {
  return (
    <details className="group rounded-card border border-line bg-surface p-5 sm:p-6">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
        {question}
        <span className="text-accent transition-transform group-open:rotate-45" aria-hidden="true">
          +
        </span>
      </summary>
      <div className="mt-3 text-ink-muted">{children}</div>
    </details>
  );
}
