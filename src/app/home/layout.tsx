import { redirect } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { HomeSidebar } from "@/components/home-sidebar";
import { PlanBlock } from "@/components/plan-block";
import { getSessionUser } from "@/lib/session";
import { getPlanUsage } from "@/lib/usage";

async function Shell({ children }: { children: ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const usage = await getPlanUsage(user.id);

  return (
    <div className="scene-hero flex min-h-screen flex-col lg:flex-row">
      <HomeSidebar email={user.email} planBlock={<PlanBlock usage={usage} />} />
      <main className="flex-1 p-4 sm:p-8 lg:p-10">{children}</main>
    </div>
  );
}

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<p className="p-8 text-ink-muted">Загрузка…</p>}>
      <Shell>{children}</Shell>
    </Suspense>
  );
}
