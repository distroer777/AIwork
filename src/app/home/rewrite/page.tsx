import type { Metadata } from "next";
import { RewriteForm } from "@/components/rewrite-form";

export const metadata: Metadata = { title: "Переписать с AI · Ярчинвест" };

export default function RewritePage() {
  return (
    <div className="max-w-5xl">
      <h1 className="mb-8 font-heading text-3xl font-bold">Переписать пост с AI</h1>
      <RewriteForm />
    </div>
  );
}
