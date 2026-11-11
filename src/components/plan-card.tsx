import Link from "next/link";
import type { PlanConfig } from "@/lib/plans";

type PlanCardProps = {
  plan: PlanConfig;
  current: boolean;
};

export function PlanCard({ plan, current }: PlanCardProps) {
  return (
    <div
      className={`relative flex flex-col rounded-card bg-surface p-6 shadow-card sm:p-8 ${
        current ? "border-2 border-success" : "border-2 border-transparent"
      }`}
    >
      {current ? (
        <span className="absolute -top-3 left-6 rounded-pill bg-success px-3 py-1 text-sm font-semibold text-on-accent">
          Текущий
        </span>
      ) : null}
      <h2 className="font-heading text-2xl font-bold">{plan.name}</h2>
      <p className="mt-2 font-heading text-xl text-accent">{plan.price}</p>
      <ul className="mt-6 flex flex-col gap-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-3">
            <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-pill bg-accent-soft text-sm font-bold text-accent" aria-hidden="true">
              ✓
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      {plan.id === "PRO" ? (
        <div className="mt-8">
          {current ? (
            <p className="font-semibold text-success">Активен</p>
          ) : (
            // Оплату подключим позже: пока кнопка ничего не делает
            <button
              type="button"
              className="rounded-pill bg-accent px-7 py-3 font-semibold text-on-accent shadow-glow transition hover:bg-accent-hover"
            >
              Купить Pro
            </button>
          )}
          {!current ? (
            <p className="mt-3 text-sm text-ink-muted">
              Нажимая «Купить Pro», вы принимаете{" "}
              <Link href="/legal/offer" className="text-accent underline">
                оферту
              </Link>
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
