import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PlanCard } from "@/components/plan-card";
import { UsageBar } from "@/components/usage-bar";
import { PLANS } from "@/lib/plans";
import { getSessionUser } from "@/lib/session";
import { getPlanUsage } from "@/lib/usage";

export const metadata: Metadata = { title: "Тарифы · Ярчинвест" };

export default async function TariffsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const usage = await getPlanUsage(user.id);
  const { plan } = usage;

  return (
    <div className="max-w-4xl">
      <h1 className="font-heading text-3xl font-bold">Тарифы</h1>

      <section className="mt-6 rounded-card bg-surface p-6 shadow-card" aria-label="Текущий тариф">
        <p className="text-sm text-ink-muted">Текущий тариф</p>
        <p className="font-heading text-2xl font-bold">{plan.name}</p>
        {plan.drafts === null ? (
          <p className="mt-3 text-ink-muted">Лимитов нет, пользуйтесь без ограничений.</p>
        ) : (
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <UsageBar used={usage.draftsUsed} limit={plan.drafts} label="Черновики" />
            {plan.rewritesPerMonth !== null ? (
              <UsageBar used={usage.rewritesUsed} limit={plan.rewritesPerMonth} label="Переписывания в этом месяце" />
            ) : null}
          </div>
        )}
      </section>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <PlanCard plan={PLANS.FREE} current={plan.id === "FREE"} />
        <PlanCard plan={PLANS.PRO} current={plan.id === "PRO"} />
      </div>
    </div>
  );
}
