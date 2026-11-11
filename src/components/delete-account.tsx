"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function DeleteAccount({ email }: { email: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function remove() {
    setError(null);
    setPending(true);
    const response = await fetch("/api/account", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ confirm: value }),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setPending(false);
      setError(data.error ?? "Не удалось удалить аккаунт");
      return;
    }
    await authClient.signOut().catch(() => undefined);
    router.replace("/");
  }

  return (
    <section className="rounded-card bg-surface p-6 shadow-card" aria-label="Удаление аккаунта">
      <h2 className="font-heading text-xl font-bold">Удаление аккаунта</h2>
      <p className="mt-2 text-ink-muted">
        Аккаунт, черновики и все загруженные файлы будут удалены без возможности восстановления.
      </p>
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-4 rounded-pill border border-danger px-6 py-3 font-semibold text-danger transition hover:bg-danger hover:text-on-accent"
        >
          Удалить аккаунт
        </button>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          <label className="flex flex-col gap-2">
            <span>
              Для подтверждения введите свой email: <strong>{email}</strong>
            </span>
            <input
              value={value}
              onChange={(event) => setValue(event.target.value)}
              disabled={pending}
              autoComplete="off"
              className="w-full rounded-control border border-line bg-surface px-4 py-3 outline-none focus:border-danger"
            />
          </label>
          {error ? <p className="text-danger" role="alert">{error}</p> : null}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={remove}
              disabled={pending || value.trim().toLowerCase() !== email.toLowerCase()}
              className="rounded-pill bg-danger px-6 py-3 font-semibold text-on-accent disabled:opacity-50"
            >
              {pending ? "Удаляем…" : "Удалить навсегда"}
            </button>
            <button type="button" onClick={() => setOpen(false)} disabled={pending} className="px-4 py-3 text-ink-muted hover:underline">
              Отмена
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
