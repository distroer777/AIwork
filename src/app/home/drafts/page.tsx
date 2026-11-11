import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DraftCard } from "@/components/draft-card";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

export const metadata: Metadata = { title: "Черновики · Ярчинвест" };

export default async function DraftsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const drafts = await prisma.draft.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      media: { orderBy: { position: "asc" }, select: { id: true, kind: true } },
    },
  });

  return (
    <div className="max-w-5xl">
      <h1 className="font-heading text-3xl font-bold">Черновики</h1>
      {drafts.length === 0 ? (
        <p className="mt-6 text-lg text-ink-muted">
          Черновиков пока нет. Перепишите пост на странице{" "}
          <Link href="/home/rewrite" className="font-semibold text-accent hover:underline">
            «Переписать с AI»
          </Link>{" "}
          и сохраните результат.
        </p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {drafts.map((draft) => (
            <DraftCard
              key={draft.id}
              draft={{
                id: draft.id,
                text: draft.text,
                firstMedia: draft.media[0] ?? null,
                mediaCount: draft.media.length,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
