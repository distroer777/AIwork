import type { ReactNode } from "react";

type CardProps = {
  title?: string;
  children: ReactNode;
  className?: string;
};

export function Card({ title, children, className = "" }: CardProps) {
  return (
    <div className={`rounded-card bg-surface p-6 shadow-card ${className}`}>
      {title ? <h3 className="font-heading text-lg font-bold">{title}</h3> : null}
      <div className={title ? "mt-3 text-ink-muted" : "text-ink-muted"}>{children}</div>
    </div>
  );
}
