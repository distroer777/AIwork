"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();

  async function signOut() {
    await authClient.signOut();
    router.replace("/login");
  }

  return (
    <button
      type="button"
      onClick={signOut}
      className="rounded-pill bg-surface px-6 py-3 font-semibold text-ink shadow-card transition hover:text-accent"
    >
      Выйти
    </button>
  );
}
