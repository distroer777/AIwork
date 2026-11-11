"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SignOutButton } from "./sign-out-button";

const items = [
  { href: "/home", label: "Главная", exact: true },
  { href: "/home/rewrite", label: "Переписать с AI" },
  { href: "/home/drafts", label: "Черновики" },
  { href: "/home/tariffs", label: "Тарифы" },
  { href: "/home/settings", label: "Настройки" },
];

type HomeSidebarProps = {
  email: string;
  planBlock: ReactNode;
};

export function HomeSidebar({ email, planBlock }: HomeSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col gap-4 border-b border-line bg-surface/70 p-4 backdrop-blur lg:min-h-screen lg:w-72 lg:shrink-0 lg:border-b-0 lg:border-r lg:p-6">
      <Link href="/home" className="font-heading text-xl font-bold text-accent">
        Ярчинвест
      </Link>
      <nav className="flex gap-1 overflow-x-auto lg:flex-col" aria-label="Кабинет">
        {items.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`whitespace-nowrap rounded-pill px-4 py-2 font-semibold transition ${
                active ? "bg-accent-soft text-accent" : "text-ink-muted hover:bg-accent-soft hover:text-accent"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto flex flex-col gap-3">
        {planBlock}
        <p className="truncate text-sm text-ink-muted" title={email}>
          {email}
        </p>
        <SignOutButton />
      </div>
    </aside>
  );
}
