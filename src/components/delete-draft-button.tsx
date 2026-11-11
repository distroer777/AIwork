"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteDraftButton({ id }: { id: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);

  async function remove() {
    setPending(true);
    await fetch(`/api/drafts/${id}`, { method: "DELETE" });
    router.refresh();
  }

  if (confirming) {
    return (
      <span className="flex items-center gap-3 text-sm">
        <button type="button" onClick={remove} disabled={pending} className="font-semibold text-danger hover:underline">
          {pending ? "Удаляем…" : "Да, удалить"}
        </button>
        <button type="button" onClick={() => setConfirming(false)} disabled={pending} className="text-ink-muted hover:underline">
          Отмена
        </button>
      </span>
    );
  }
  return (
    <button type="button" onClick={() => setConfirming(true)} className="text-sm text-ink-muted hover:text-danger">
      Удалить
    </button>
  );
}
