"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MediaPicker, type ExistingMedia } from "./media-picker";

type DraftEditorProps = {
  id: string;
  initialText: string;
  media: ExistingMedia[];
};

export function DraftEditor({ id, initialText, media }: DraftEditorProps) {
  const router = useRouter();
  const [text, setText] = useState(initialText);
  const [removed, setRemoved] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const existing = media.filter((item) => !removed.includes(item.id));

  async function save() {
    setError(null);
    setSaving(true);
    const form = new FormData();
    form.set("text", text);
    form.set("removeIds", JSON.stringify(removed));
    newFiles.forEach((file) => form.append("files", file));
    try {
      const response = await fetch(`/api/drafts/${id}`, { method: "PATCH", body: form });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Не удалось сохранить");
        return;
      }
      router.push("/home/drafts");
      router.refresh();
    } catch {
      setError("Нет связи с сервером, попробуйте позже");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-5 rounded-card bg-surface p-6 shadow-card">
      <label className="flex flex-col gap-2">
        <span className="font-semibold">Текст</span>
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={12}
          disabled={saving}
          className="w-full rounded-control border border-line bg-surface px-4 py-3 outline-none focus:border-accent"
        />
      </label>
      <MediaPicker
        existing={existing}
        newFiles={newFiles}
        onAdd={(files) => setNewFiles((current) => [...current, ...files])}
        onRemoveExisting={(mediaId) => setRemoved((current) => [...current, mediaId])}
        onRemoveNew={(index) => setNewFiles((current) => current.filter((_, i) => i !== index))}
        disabled={saving}
      />
      {error ? <p className="text-danger" role="alert">{error}</p> : null}
      <button
        type="button"
        onClick={save}
        disabled={saving || !text.trim()}
        className="w-fit rounded-pill bg-accent px-7 py-3 font-semibold text-on-accent shadow-glow transition hover:bg-accent-hover disabled:opacity-60"
      >
        {saving ? "Сохранение..." : "Сохранить"}
      </button>
    </div>
  );
}
