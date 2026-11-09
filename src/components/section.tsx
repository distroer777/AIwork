import type { ReactNode } from "react";
import { Container } from "./container";

type SectionProps = {
  id?: string;
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  tone?: "default" | "surface";
  children: ReactNode;
};

export function Section({ id, eyebrow, title, subtitle, tone = "default", children }: SectionProps) {
  return (
    <section id={id} className={tone === "surface" ? "bg-surface" : "bg-bg"}>
      <Container className="py-14 sm:py-20">
        {eyebrow ? (
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-accent">{eyebrow}</p>
        ) : null}
        <h2 className="max-w-3xl font-heading text-2xl font-bold sm:text-3xl lg:text-4xl">{title}</h2>
        {subtitle ? <p className="mt-4 max-w-2xl text-lg text-ink-muted">{subtitle}</p> : null}
        <div className="mt-8 sm:mt-12">{children}</div>
      </Container>
    </section>
  );
}
