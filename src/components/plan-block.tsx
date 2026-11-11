import Link from "next/link";
import { UsageBar } from "./usage-bar";
import type { PlanUsage } from "@/lib/usage";

/** Компактный блок тарифа для бокового меню. */
export function PlanBlock({ usage }: { usage: PlanUsage }) {
  const { plan, draftsUsed } = usage;
  return (
    <Link
      href="/home/tariffs"
      className="block rounded-card bg-surface p-4 text-ink shadow-card transition hover:-translate-y-0.5"
    >
      <p className="text-sm text-ink-muted">Ваш тариф</p>
      <p className="font-heading text-lg font-bold">{plan.name}</p>
      <div className="mt-3">
        {plan.drafts === null ? (
          <p className="text-sm text-ink-muted">Без ограничений</p>
        ) : (
          <UsageBar used={draftsUsed} limit={plan.drafts} label="Черновики" />
        )}
      </div>
    </Link>
  );
}
