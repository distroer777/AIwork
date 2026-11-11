import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { RewriteForm } from "@/components/rewrite-form";

export const metadata: Metadata = { title: "Переписать с AI · Ярчинвест" };

export default function RewritePage() {
  return (
    <main className="scene-hero min-h-screen">
      <Container className="py-12">
        <Link href="/home" className="text-accent hover:underline">
          ← Личный кабинет
        </Link>
        <h1 className="mt-4 mb-8 font-heading text-3xl font-bold">Переписать пост с AI</h1>
        <RewriteForm />
      </Container>
    </main>
  );
}
