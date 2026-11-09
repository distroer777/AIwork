"use client";

import Link from "next/link";
import { useState } from "react";
import { ButtonLink } from "./button";
import { Container } from "./container";

const links = [
  { href: "#idea", label: "Идея" },
  { href: "#method", label: "Метод" },
  { href: "#trainer", label: "Тренажёр" },
  { href: "#program", label: "Программа" },
  { href: "#stories", label: "Истории" },
  { href: "#pricing", label: "Стоимость" },
];

const cabinetUrl = "https://yarchinvest.online/cabinet.html";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-3 z-10 px-3 sm:px-6">
      <Container className="flex items-center justify-between gap-4 rounded-pill bg-surface/80 py-2 pl-5 pr-2 shadow-card backdrop-blur-lg">
        <Link href="/" className="font-heading text-lg font-bold text-accent sm:text-xl">
          Ярчинвест
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Разделы страницы">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="rounded-pill px-3 py-2 text-ink-muted transition hover:bg-accent-soft hover:text-accent">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ButtonLink href={cabinetUrl} variant="secondary" className="hidden px-4 py-2 text-sm lg:inline-flex">
            Личный кабинет
          </ButtonLink>
          <ButtonLink href="#join" className="px-4 py-2 text-sm">
            Начать обучение
          </ButtonLink>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            className="flex size-10 items-center justify-center rounded-pill bg-accent-soft text-xl lg:hidden"
          >
            {open ? "×" : "☰"}
          </button>
        </div>
      </Container>

      {open ? (
        <nav className="mt-2 rounded-card bg-surface shadow-card lg:hidden" aria-label="Мобильное меню">
          <Container className="flex flex-col py-2">
            {[...links, { href: "#author", label: "Автор" }].map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-line py-3 text-lg"
              >
                {link.label}
              </a>
            ))}
            <a href={cabinetUrl} className="py-3 text-lg text-accent">
              Личный кабинет
            </a>
          </Container>
        </nav>
      ) : null}
    </header>
  );
}
