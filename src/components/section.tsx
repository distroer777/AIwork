import type { ReactNode } from "react";
import { Container } from "./container";

type SectionProps = {
  id?: string;
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  tone?: "default" | "surface" | "dark";
  children: ReactNode;
};

export function Section({ id, eyebrow, title, subtitle, tone = "default", children }: SectionProps) {
  return (
    <section id={id} className={tone === "surface" ? "scene-paper" : tone === "dark" ? "scene-dark" : "bg-bg"}>
      <Container className="py-16 sm:py-24">
        {eyebrow ? (
          <p className="mb-3 flex items-center gap-2.5 text-sm font-semibold text-kicker"><span className="size-2 rounded-pill bg-kicker" aria-hidden="true" />{eyebrow}</p>
        ) : null}
        <h2 className="max-w-3xl font-heading text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">{title}</h2>
        {subtitle ? <p className="mt-4 max-w-2xl text-lg text-ink-muted [.scene-dark_&]:text-on-navy/70">{subtitle}</p> : null}
        <div className="mt-8 sm:mt-12">{children}</div>
      </Container>
    </section>
  );
}
