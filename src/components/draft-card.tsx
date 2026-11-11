import Link from "next/link";
import { DeleteDraftButton } from "./delete-draft-button";

export type DraftCardData = {
  id: string;
  text: string;
  firstMedia: { id: string; kind: string } | null;
  mediaCount: number;
};

export function DraftCard({ draft }: { draft: DraftCardData }) {
  const rest = draft.mediaCount - 1;
  return (
    <article className="flex flex-col overflow-hidden rounded-card bg-surface shadow-card">
      <div className="relative aspect-video bg-accent-soft">
        {draft.firstMedia ? (
          <>
            {draft.firstMedia.kind === "video" ? (
              <video src={`/api/media/${draft.firstMedia.id}`} muted preload="metadata" className="size-full object-cover" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={`/api/media/${draft.firstMedia.id}`} alt="" className="size-full object-cover" />
            )}
            {draft.firstMedia.kind === "video" ? (
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
                <span className="flex size-12 items-center justify-center rounded-pill bg-navy/70 text-xl text-on-ink">▶</span>
              </span>
            ) : null}
            {rest > 0 ? (
              <span className="absolute bottom-2 right-2 rounded-pill bg-navy/80 px-3 py-1 text-sm font-semibold text-on-ink">
                +{rest}
              </span>
            ) : null}
          </>
        ) : (
          <span className="flex size-full items-center justify-center text-ink-muted">Без файлов</span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <p className="line-clamp-4 whitespace-pre-line">{draft.text}</p>
        <div className="mt-auto flex items-center justify-between">
          <Link href={`/home/drafts/${draft.id}`} className="font-semibold text-accent hover:underline">
            Открыть
          </Link>
          <DeleteDraftButton id={draft.id} />
        </div>
      </div>
    </article>
  );
}
