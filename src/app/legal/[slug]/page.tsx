import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { LegalBody } from "@/components/legal-body";
import { SiteFooter } from "@/components/site-footer";
import { LEGAL_SLUGS, formatDate, getLegalDoc, isLegalSlug } from "@/lib/legal";

export function generateStaticParams() {
  return LEGAL_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (!isLegalSlug(slug)) return {};
  const doc = await getLegalDoc(slug);
  return { title: `${doc.title} · Ярчинвест` };
}

export default async function LegalDocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isLegalSlug(slug)) notFound();
  const doc = await getLegalDoc(slug);

  return (
    <>
      <main className="scene-hero">
        <Container className="py-16">
          <div className="max-w-3xl">
          <Link href="/legal" className="text-accent hover:underline">
            ← Все документы
          </Link>
          <h1 className="mt-4 font-heading text-3xl font-bold">{doc.title}</h1>
          <p className="mt-2 text-ink-muted">
            Редакция от {formatDate(doc.date)}, версия {doc.version}
          </p>
          <div className="mt-8 rounded-card bg-surface p-6 shadow-card sm:p-8">
            <LegalBody body={doc.body} />
          </div>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
