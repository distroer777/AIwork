import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DeleteAccount } from "@/components/delete-account";
import { getSessionUser } from "@/lib/session";

export const metadata: Metadata = { title: "Настройки · Ярчинвест" };

export default async function SettingsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  return (
    <div className="max-w-2xl">
      <h1 className="font-heading text-3xl font-bold">Настройки профиля</h1>
      <section className="mt-6 rounded-card bg-surface p-6 shadow-card" aria-label="Профиль">
        <p className="text-sm text-ink-muted">Email</p>
        <p className="text-lg font-semibold">{user.email}</p>
      </section>
      <div className="mt-6">
        <DeleteAccount email={user.email} />
      </div>
    </div>
  );
}
