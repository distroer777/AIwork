import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { SiteFooter } from "@/components/site-footer";
import { formatDate, getAllLegalDocs } from "@/lib/legal";

export const metadata: Metadata = { title: "Документы · Ярчинвест" };

export default async function LegalPage() {
  const docs = await getAllLegalDocs();
  return (
    <>
      <main className="scene-hero">
        <Container className="py-16">
          <Link href="/" className="text-accent hover:underline">
            ← На главную
          </Link>
          <h1 className="mt-4 font-heading text-3xl font-bold">Документы</h1>
          <ul className="mt-8 flex max-w-2xl flex-col gap-4">
            {docs.map((doc) => (
              <li key={doc.slug}>
                <Link href={`/legal/${doc.slug}`} className="block rounded-card bg-surface p-6 shadow-card transition hover:-translate-y-0.5">
                  <span className="font-heading text-lg font-bold">{doc.title}</span>
                  <span className="mt-1 block text-ink-muted">
                    Редакция от {formatDate(doc.date)}, версия {doc.version}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
