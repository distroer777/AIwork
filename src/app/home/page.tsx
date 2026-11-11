import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Личный кабинет · Ярчинвест" };

const cardClass = "block rounded-card bg-surface p-6 shadow-card transition hover:-translate-y-0.5";

export default function HomePage() {
  return (
    <div className="max-w-4xl">
      <h1 className="font-heading text-3xl font-bold">Личный кабинет</h1>
      <p className="mt-3 text-lg text-ink-muted">Переписывайте посты с AI и храните черновики с фото и видео.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link href="/home/rewrite" className={cardClass}>
          <h2 className="font-heading text-lg font-bold">Переписать с AI</h2>
          <p className="mt-2 text-ink-muted">Вставьте пост, выберите формат</p>
        </Link>
        <Link href="/home/drafts" className={cardClass}>
          <h2 className="font-heading text-lg font-bold">Черновики</h2>
          <p className="mt-2 text-ink-muted">Сохранённые посты и файлы</p>
        </Link>
        <Link href="/home/tariffs" className={cardClass}>
          <h2 className="font-heading text-lg font-bold">Тарифы</h2>
          <p className="mt-2 text-ink-muted">Ваш тариф и лимиты</p>
        </Link>
      </div>
    </div>
  );
}
