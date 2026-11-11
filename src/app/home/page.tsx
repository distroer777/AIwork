import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { SignOutButton } from "@/components/sign-out-button";
import { Container } from "@/components/container";
import { auth } from "@/lib/auth";

export const metadata: Metadata = { title: "Личный кабинет · Ярчинвест" };

async function HomeContent() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  return (
    <Container className="py-16">
      <h1 className="font-heading text-3xl font-bold">Личный кабинет</h1>
      <p className="mt-4 text-lg text-ink-muted">Вы вошли как {session.user.email}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/home/rewrite"
          className="rounded-pill bg-accent px-7 py-3 font-semibold text-on-accent shadow-glow transition hover:bg-accent-hover"
        >
          Переписать пост с AI
        </Link>
        <SignOutButton />
      </div>
    </Container>
  );
}

export default function HomePage() {
  return (
    <main className="scene-hero min-h-screen">
      <Suspense fallback={<p className="p-8 text-ink-muted">Загрузка…</p>}>
        <HomeContent />
      </Suspense>
    </main>
  );
}
