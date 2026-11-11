import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { rewritePost } from "@/lib/rewrite";
import type { RewriteFormat } from "@/lib/rewrite-prompts";

const FORMATS: RewriteFormat[] = ["original", "short", "longread"];
const MAX_TEXT = 8000;
const MAX_INSTRUCTIONS = 500;

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ error: "Войдите в аккаунт" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const text = typeof body.text === "string" ? body.text.trim() : "";
  const format = body.format as RewriteFormat;
  const hasMedia = body.hasMedia === true;
  const instructions = typeof body.instructions === "string" ? body.instructions.slice(0, MAX_INSTRUCTIONS) : "";

  if (!text || text.length > MAX_TEXT) {
    return Response.json({ error: `Текст поста: от 1 до ${MAX_TEXT} символов` }, { status: 400 });
  }
  if (!FORMATS.includes(format)) {
    return Response.json({ error: "Неизвестный формат" }, { status: 400 });
  }

  try {
    const result = await rewritePost({ text, format, hasMedia, instructions });
    return Response.json({ result });
  } catch (error) {
    // В лог только идентификатор пользователя и причина, без текста поста
    console.error(`rewrite: ошибка для пользователя ${session.user.id}:`, error instanceof Error ? error.message : "unknown");
    return Response.json({ error: "Не удалось переписать пост, попробуйте позже" }, { status: 502 });
  }
}
