import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { MAX_FILES_PER_DRAFT, prepareFiles } from "@/lib/media";
import { deleteObjects, putObject } from "@/lib/s3";
import { getSessionUser } from "@/lib/session";
import { getPlanUsage } from "@/lib/usage";

const MAX_TEXT = 8000;

// Создание черновика: текст и файлы (multipart/form-data)
export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Войдите в аккаунт" }, { status: 401 });

  const usage = await getPlanUsage(user.id);
  if (usage.draftsLeft === 0) {
    return Response.json(
      { error: `Лимит исчерпан: на тарифе ${usage.plan.name} можно хранить до ${usage.plan.drafts} черновиков`, code: "LIMIT_REACHED" },
      { status: 403 },
    );
  }

  const form = await request.formData();
  const text = String(form.get("text") ?? "").trim();
  const files = form.getAll("files").filter((item): item is File => item instanceof File && item.size > 0);

  if (!text || text.length > MAX_TEXT) {
    return Response.json({ error: `Текст черновика: от 1 до ${MAX_TEXT} символов` }, { status: 400 });
  }
  if (files.length > MAX_FILES_PER_DRAFT) {
    return Response.json({ error: `Не больше ${MAX_FILES_PER_DRAFT} файлов в черновике` }, { status: 400 });
  }

  const draftId = randomUUID();
  const prepared = await prepareFiles(files, user.id, draftId);
  if (!prepared.ok) return Response.json({ error: prepared.error }, { status: 400 });

  const uploaded: string[] = [];
  try {
    for (const file of prepared.files) {
      await putObject(file.key, file.buffer, file.contentType);
      uploaded.push(file.key);
    }
    await prisma.draft.create({
      data: {
        id: draftId,
        userId: user.id,
        text,
        media: {
          create: prepared.files.map((file, position) => ({
            key: file.key,
            contentType: file.contentType,
            size: file.size,
            kind: file.kind,
            position,
          })),
        },
      },
    });
  } catch (error) {
    // Не оставляем в хранилище файлы несозданного черновика
    await deleteObjects(uploaded).catch(() => undefined);
    console.error(`drafts: не удалось сохранить черновик пользователя ${user.id}:`, error instanceof Error ? error.message : "unknown");
    return Response.json({ error: "Не удалось сохранить черновик, попробуйте позже" }, { status: 500 });
  }

  return Response.json({ id: draftId }, { status: 201 });
}
