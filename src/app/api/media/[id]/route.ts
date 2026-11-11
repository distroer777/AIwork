import { prisma } from "@/lib/prisma";
import { signedGetUrl } from "@/lib/s3";
import { getSessionUser } from "@/lib/session";

type Context = { params: Promise<{ id: string }> };

// Отдаёт файл только владельцу черновика: перенаправляет на временную ссылку хранилища
export async function GET(_request: Request, { params }: Context) {
  const user = await getSessionUser();
  if (!user) return new Response("Unauthorized", { status: 401 });
  const { id } = await params;

  const media = await prisma.draftMedia.findFirst({
    where: { id, draft: { userId: user.id } },
    select: { key: true },
  });
  if (!media) return new Response("Not found", { status: 404 });

  const url = await signedGetUrl(media.key, 300);
  return new Response(null, {
    status: 307,
    headers: { Location: url, "Cache-Control": "private, max-age=120" },
  });
}
