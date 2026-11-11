import { prisma } from "@/lib/prisma";
import { deleteObjects } from "@/lib/s3";
import { getSessionUser } from "@/lib/session";

// Удаление аккаунта: данные пользователя и все его файлы в хранилище
export async function DELETE(request: Request) {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Войдите в аккаунт" }, { status: 401 });

  let confirm = "";
  try {
    const body = await request.json();
    confirm = typeof body?.confirm === "string" ? body.confirm.trim().toLowerCase() : "";
  } catch {
    return Response.json({ error: "Некорректный запрос" }, { status: 400 });
  }
  if (confirm !== user.email.toLowerCase()) {
    return Response.json({ error: "Email для подтверждения не совпал" }, { status: 400 });
  }

  const media = await prisma.draftMedia.findMany({ where: { draft: { userId: user.id } }, select: { key: true } });

  // Каскад удаляет сессии, черновики, файлы-записи, использование лимитов и согласия
  await prisma.authUser.delete({ where: { id: user.id } });
  await prisma.authVerification.deleteMany({ where: { identifier: { contains: user.email } } });

  const keys = media.map((item) => item.key);
  for (let index = 0; index < keys.length; index += 1000) {
    await deleteObjects(keys.slice(index, index + 1000)).catch(() => {
      console.error(`account: часть файлов пользователя ${user.id} не удалилась из хранилища`);
    });
  }

  return Response.json({ ok: true });
}
