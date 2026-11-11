import { readFile } from "node:fs/promises";
import path from "node:path";
import { COMPANY, requisitesLines } from "@/lib/company";

// Документы лежат в _docs/legal. Версия и дата редакции указаны в начале каждого файла.
export const LEGAL_SLUGS = ["terms", "privacy", "consent", "offer"] as const;
export type LegalSlug = (typeof LEGAL_SLUGS)[number];

export type LegalDoc = {
  slug: LegalSlug;
  title: string;
  version: string;
  date: string;
  body: string;
};

export function isLegalSlug(value: string): value is LegalSlug {
  return (LEGAL_SLUGS as readonly string[]).includes(value);
}

function fill(text: string): string {
  return text
    .replaceAll("{{company}}", COMPANY.name)
    .replaceAll("{{inn}}", COMPANY.inn)
    .replaceAll("{{email}}", COMPANY.email)
    .replaceAll("{{requisites}}", requisitesLines().map((line) => `- ${line}`).join("\n"));
}

export async function getLegalDoc(slug: LegalSlug): Promise<LegalDoc> {
  const raw = await readFile(path.join(process.cwd(), "_docs", "legal", `${slug}.md`), "utf-8");
  const match = raw.replace(/\r\n/g, "\n").match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`Документ ${slug}: нет заголовка с версией`);
  const meta: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const index = line.indexOf(":");
    if (index > 0) meta[line.slice(0, index).trim()] = line.slice(index + 1).trim();
  }
  return {
    slug,
    title: meta.title ?? slug,
    version: meta.version ?? "1.0",
    date: meta.date ?? "",
    body: fill(match[2].trim()),
  };
}

export async function getAllLegalDocs(): Promise<LegalDoc[]> {
  return Promise.all(LEGAL_SLUGS.map((slug) => getLegalDoc(slug)));
}

export function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  return date.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}
