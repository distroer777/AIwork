"use client";

import { useState } from "react";
import { FORMAT_LABELS, countChars, getLimit, type RewriteFormat } from "@/lib/rewrite-prompts";

const fieldClass = "w-full rounded-control border border-line bg-surface px-4 py-3 outline-none focus:border-accent";

export function RewriteForm() {
  const [text, setText] = useState("");
  const [format, setFormat] = useState<RewriteFormat>("original");
  const [hasMedia, setHasMedia] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const limit = getLimit(format, hasMedia);

  async function rewrite() {
    setError(null);
    setPending(true);
    try {
      const response = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, format, hasMedia, instructions }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Не удалось переписать пост");
        return;
      }
      setResult(data.result);
    } catch {
      setError("Нет связи с сервером, попробуйте позже");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="flex flex-col gap-4 rounded-card bg-surface p-6 shadow-card">
        <label className="flex flex-col gap-2">
          <span className="font-semibold">Текст поста</span>
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={10}
            className={fieldClass}
            placeholder="Вставьте пост из Telegram-канала"
          />
        </label>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 font-semibold">Формат</legend>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(FORMAT_LABELS) as RewriteFormat[]).map((key) => (
              <label key={key} className="cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  value={key}
                  checked={format === key}
                  onChange={() => setFormat(key)}
                  className="peer sr-only"
                />
                <span className="inline-block rounded-pill border border-line px-4 py-2 peer-checked:border-accent peer-checked:bg-accent peer-checked:text-on-accent">
                  {FORMAT_LABELS[key]}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="flex items-center gap-3">
          <input type="checkbox" checked={hasMedia} onChange={(event) => setHasMedia(event.target.checked)} />
          <span>Пост с медиа (фото или видео)</span>
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-semibold">Дополнительные инструкции</span>
          <textarea
            value={instructions}
            onChange={(event) => setInstructions(event.target.value)}
            rows={3}
            maxLength={500}
            className={fieldClass}
            placeholder="Например: добавь призыв подписаться в конце"
          />
        </label>

        {error ? <p className="text-danger" role="alert">{error}</p> : null}
        <button
          type="button"
          onClick={rewrite}
          disabled={pending || !text.trim()}
          className="rounded-pill bg-accent px-7 py-4 font-semibold text-on-accent shadow-glow transition hover:bg-accent-hover disabled:opacity-60"
        >
          {pending ? "Переписываем…" : "Переписать"}
        </button>
      </div>

      <div className="flex flex-col gap-2 rounded-card bg-surface p-6 shadow-card">
        <label htmlFor="rewrite-result" className="font-semibold">Результат (можно править)</label>
        <textarea
          id="rewrite-result"
          value={result}
          onChange={(event) => setResult(event.target.value)}
          rows={16}
          className={fieldClass}
          placeholder="Здесь появится переписанный пост"
        />
        <p className="text-sm text-ink-muted">
          {countChars(result)} символов{limit ? ` из ${limit}` : ""}
        </p>
      </div>
    </div>
  );
}
