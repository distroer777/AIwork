"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MediaPicker } from "./media-picker";
import { FORMAT_LABELS, countChars, getLimit, type RewriteFormat } from "@/lib/rewrite-prompts";

const fieldClass = "w-full rounded-control border border-line bg-surface px-4 py-3 outline-none focus:border-accent";

export function RewriteForm() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [format, setFormat] = useState<RewriteFormat>("original");
  const [hasMedia, setHasMedia] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

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

  async function saveDraft() {
    setSaveError(null);
    setSaved(false);
    setSaving(true);
    const form = new FormData();
    form.set("text", result);
    files.forEach((file) => form.append("files", file));
    try {
      const response = await fetch("/api/drafts", { method: "POST", body: form });
      const data = await response.json();
      if (!response.ok) {
        setSaveError(data.error ?? "Не удалось сохранить черновик");
        return;
      }
      setSaved(true);
      setFiles([]);
      router.refresh();
    } catch {
      setSaveError("Нет связи с сервером, попробуйте позже");
    } finally {
      setSaving(false);
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

        <div className="mt-4 flex flex-col gap-4 border-t border-line pt-5">
          <MediaPicker
            newFiles={files}
            onAdd={(added) => setFiles((current) => [...current, ...added])}
            onRemoveNew={(index) => setFiles((current) => current.filter((_, i) => i !== index))}
            disabled={saving}
          />
          {saveError ? (
            <p className="text-danger" role="alert">
              {saveError}{" "}
              <Link href="/home/tariffs" className="font-semibold underline">
                Тарифы
              </Link>
            </p>
          ) : null}
          {saved ? (
            <p className="text-success" role="status">
              Черновик сохранён.{" "}
              <Link href="/home/drafts" className="font-semibold underline">
                Открыть черновики
              </Link>
            </p>
          ) : null}
          <button
            type="button"
            onClick={saveDraft}
            disabled={saving || !result.trim()}
            className="w-fit rounded-pill bg-accent px-7 py-3 font-semibold text-on-accent shadow-glow transition hover:bg-accent-hover disabled:opacity-60"
          >
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      </div>
    </div>
  );
}
