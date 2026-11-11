import { prisma } from "@/lib/prisma";
import { getAllLegalDocs } from "@/lib/legal";
import { getSessionUser } from "@/lib/session";

function clientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip");
}

// Записывает, что пользователь принял документы: кто, когда, с какого IP, какая версия
export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Войдите в аккаунт" }, { status: 401 });

  let marketing = false;
  try {
    const body = await request.json();
    marketing = body?.marketing === true;
  } catch {
    // пустое тело: принимаем только обязательные документы
  }

  const docs = await getAllLegalDocs();
  const required = docs.filter((doc) => doc.slug === "terms" || doc.slug === "privacy" || doc.slug === "consent");
  const items = required.map((doc) => ({ document: doc.slug, version: doc.version }));
  if (marketing) items.push({ document: "marketing", version: "1.0" });

  const existing = await prisma.consent.findMany({ where: { userId: user.id }, select: { document: true, version: true } });
  const fresh = items.filter((item) => !existing.some((e) => e.document === item.document && e.version === item.version));

  if (fresh.length > 0) {
    const ip = clientIp(request);
    const userAgent = request.headers.get("user-agent");
    await prisma.consent.createMany({
      data: fresh.map((item) => ({ userId: user.id, ip, userAgent, ...item })),
    });
  }
  return Response.json({ ok: true });
}
