import { prisma } from "@/lib/prisma";
import { MAX_FILES_PER_DRAFT, prepareFiles } from "@/lib/media";
import { deleteObjects, putObject } from "@/lib/s3";
import { getSessionUser } from "@/lib/session";

const MAX_TEXT = 8000;

type Context = { params: Promise<{ id: string }> };

// Изменение черновика: новый текст, удалённые и добавленные файлы
export async function PATCH(request: Request, { params }: Context) {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Войдите в аккаунт" }, { status: 401 });
  const { id } = await params;

  // Ищем вместе с владельцем: чужой черновик не найдётся
  const draft = await prisma.draft.findFirst({
    where: { id, userId: user.id },
    include: { media: { orderBy: { position: "asc" } } },
  });
  if (!draft) return Response.json({ error: "Черновик не найден" }, { status: 404 });

  const form = await request.formData();
  const text = String(form.get("text") ?? "").trim();
  const files = form.getAll("files").filter((item): item is File => item instanceof File && item.size > 0);
  let removeIds: string[] = [];
  try {
    const parsed = JSON.parse(String(form.get("removeIds") ?? "[]"));
    if (Array.isArray(parsed)) removeIds = parsed.filter((value): value is string => typeof value === "string");
  } catch {
    return Response.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  if (!text || text.length > MAX_TEXT) {
    return Response.json({ error: `Текст черновика: от 1 до ${MAX_TEXT} символов` }, { status: 400 });
  }

  const toRemove = draft.media.filter((item) => removeIds.includes(item.id));
  const remaining = draft.media.length - toRemove.length;
  if (remaining + files.length > MAX_FILES_PER_DRAFT) {
    return Response.json({ error: `Не больше ${MAX_FILES_PER_DRAFT} файлов в черновике` }, { status: 400 });
  }

  const prepared = await prepareFiles(files, user.id, draft.id);
  if (!prepared.ok) return Response.json({ error: prepared.error }, { status: 400 });

  const uploaded: string[] = [];
  try {
    for (const file of prepared.files) {
      await putObject(file.key, file.buffer, file.contentType);
      uploaded.push(file.key);
    }
    const lastPosition = draft.media.reduce((max, item) => Math.max(max, item.position), -1);
    await prisma.$transaction([
      prisma.draftMedia.deleteMany({ where: { draftId: draft.id, id: { in: toRemove.map((item) => item.id) } } }),
      prisma.draftMedia.createMany({
        data: prepared.files.map((file, index) => ({
          draftId: draft.id,
          key: file.key,
          contentType: file.contentType,
          size: file.size,
          kind: file.kind,
          position: lastPosition + 1 + index,
        })),
      }),
      prisma.draft.update({ where: { id: draft.id }, data: { text } }),
    ]);
  } catch (error) {
    await deleteObjects(uploaded).catch(() => undefined);
    console.error(`drafts: не удалось обновить черновик ${draft.id} пользователя ${user.id}:`, error instanceof Error ? error.message : "unknown");
    return Response.json({ error: "Не удалось сохранить изменения, попробуйте позже" }, { status: 500 });
  }

  // Удалённые пользователем файлы убираем из хранилища
  await deleteObjects(toRemove.map((item) => item.key)).catch(() => {
    console.error(`drafts: файлы черновика ${draft.id} не удалились из хранилища`);
  });

  return Response.json({ id: draft.id });
}

// Удаление черновика вместе с файлами в хранилище
export async function DELETE(_request: Request, { params }: Context) {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Войдите в аккаунт" }, { status: 401 });
  const { id } = await params;

  const draft = await prisma.draft.findFirst({
    where: { id, userId: user.id },
    include: { media: { select: { key: true } } },
  });
  if (!draft) return Response.json({ error: "Черновик не найден" }, { status: 404 });

  await prisma.draft.delete({ where: { id: draft.id } });
  await deleteObjects(draft.media.map((item) => item.key)).catch(() => {
    console.error(`drafts: файлы черновика ${draft.id} не удалились из хранилища`);
  });

  return Response.json({ ok: true });
}
