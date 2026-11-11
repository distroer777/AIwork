import { prisma } from "@/lib/prisma";
import { PLANS, type PlanConfig, type PlanId } from "@/lib/plans";

export type PlanUsage = {
  plan: PlanConfig;
  draftsUsed: number;
  rewritesUsed: number;
  draftsLeft: number | null;
  rewritesLeft: number | null;
};

function startOfMonth(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

/** Текущий тариф пользователя: Pro действует, пока не истёк planUntil (если он задан). */
export async function getUserPlanId(userId: string): Promise<PlanId> {
  const user = await prisma.authUser.findUnique({
    where: { id: userId },
    select: { plan: true, planUntil: true },
  });
  if (user?.plan === "PRO" && (!user.planUntil || user.planUntil > new Date())) return "PRO";
  return "FREE";
}

export async function getPlanUsage(userId: string): Promise<PlanUsage> {
  const [planId, draftsUsed, rewritesUsed] = await Promise.all([
    getUserPlanId(userId),
    prisma.draft.count({ where: { userId } }),
    prisma.rewriteUsage.count({ where: { userId, createdAt: { gte: startOfMonth() } } }),
  ]);
  const plan = PLANS[planId];
  return {
    plan,
    draftsUsed,
    rewritesUsed,
    draftsLeft: plan.drafts === null ? null : Math.max(plan.drafts - draftsUsed, 0),
    rewritesLeft: plan.rewritesPerMonth === null ? null : Math.max(plan.rewritesPerMonth - rewritesUsed, 0),
  };
}
