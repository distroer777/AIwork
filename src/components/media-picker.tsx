"use client";

import { useEffect, useState } from "react";

export type ExistingMedia = { id: string; kind: "image" | "video" };

const ACCEPT = "image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm";

function PlayIcon() {
  return (
    <span className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
      <span className="flex size-9 items-center justify-center rounded-pill bg-navy/70 text-on-ink">▶</span>
    </span>
  );
}

function RemoveButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Убрать файл"
      className="absolute right-1.5 top-1.5 flex size-7 items-center justify-center rounded-pill bg-navy/80 text-on-ink hover:bg-danger disabled:opacity-50"
    >
      ×
    </button>
  );
}

function NewFileThumb({ file, onRemove, disabled }: { file: File; onRemove: () => void; disabled?: boolean }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);
  const isVideo = file.type.startsWith("video/");

  return (
    <div className="relative aspect-square overflow-hidden rounded-control bg-line">
      {url && isVideo ? <video src={url} muted preload="metadata" className="size-full object-cover" /> : null}
      {url && !isVideo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="size-full object-cover" />
      ) : null}
      {isVideo ? <PlayIcon /> : null}
      <RemoveButton onClick={onRemove} disabled={disabled} />
    </div>
  );
}

type MediaPickerProps = {
  existing?: ExistingMedia[];
  newFiles: File[];
  onAdd: (files: File[]) => void;
  onRemoveExisting?: (id: string) => void;
  onRemoveNew: (index: number) => void;
  disabled?: boolean;
};

export function MediaPicker({ existing = [], newFiles, onAdd, onRemoveExisting, onRemoveNew, disabled }: MediaPickerProps) {
  return (
    <div className="flex flex-col gap-3">
      <span className="font-semibold">Фото и видео</span>
      {existing.length + newFiles.length > 0 ? (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {existing.map((item) => (
            <div key={item.id} className="relative aspect-square overflow-hidden rounded-control bg-line">
              {item.kind === "video" ? (
                <video src={`/api/media/${item.id}`} muted preload="metadata" className="size-full object-cover" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={`/api/media/${item.id}`} alt="" className="size-full object-cover" />
              )}
              {item.kind === "video" ? <PlayIcon /> : null}
              <RemoveButton onClick={() => onRemoveExisting?.(item.id)} disabled={disabled} />
            </div>
          ))}
          {newFiles.map((file, index) => (
            <NewFileThumb key={`${file.name}-${index}`} file={file} onRemove={() => onRemoveNew(index)} disabled={disabled} />
          ))}
        </div>
      ) : null}
      <label className={`inline-flex w-fit cursor-pointer rounded-pill bg-accent-soft px-5 py-2 font-semibold text-accent transition hover:bg-line ${disabled ? "pointer-events-none opacity-60" : ""}`}>
        Добавить файлы
        <input
          type="file"
          multiple
          accept={ACCEPT}
          className="sr-only"
          disabled={disabled}
          onChange={(event) => {
            onAdd(Array.from(event.target.files ?? []));
            event.target.value = "";
          }}
        />
      </label>
      <p className="text-sm text-ink-muted">Фото до 10 МБ, видео до 50 МБ, не больше 10 файлов</p>
    </div>
  );
}
