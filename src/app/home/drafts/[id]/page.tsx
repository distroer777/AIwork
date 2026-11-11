import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { DraftEditor } from "@/components/draft-editor";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

export const metadata: Metadata = { title: "Черновик · Ярчинвест" };

export default async function DraftPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const { id } = await params;

  // Ищем вместе с владельцем
  const draft = await prisma.draft.findFirst({
    where: { id, userId: user.id },
    include: { media: { orderBy: { position: "asc" }, select: { id: true, kind: true } } },
  });
  if (!draft) notFound();

  return (
    <div className="max-w-3xl">
      <Link href="/home/drafts" className="text-accent hover:underline">
        ← Черновики
      </Link>
      <h1 className="mt-4 mb-6 font-heading text-3xl font-bold">Редактирование черновика</h1>
      <DraftEditor
        id={draft.id}
        initialText={draft.text}
        media={draft.media.map((item) => ({ id: item.id, kind: item.kind === "video" ? "video" : "image" }))}
      />
    </div>
  );
}
