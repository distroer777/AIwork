"use client";

import { useState } from "react";

type Level = "beginner" | "practitioner";
type Contact = "telegram" | "phone" | "vk";

const levels: { id: Level; label: string; price: string }[] = [
  { id: "beginner", label: "Начинающий", price: "20 000 ₽" },
  { id: "practitioner", label: "Практикующий", price: "35 000 ₽" },
];

const contacts: { id: Contact; label: string; placeholder: string }[] = [
  { id: "telegram", label: "Telegram", placeholder: "@username" },
  { id: "phone", label: "Звонок", placeholder: "+7 900 000-00-00" },
  { id: "vk", label: "VK", placeholder: "Ссылка на профиль" },
];

const fieldClass =
  "w-full rounded-control border border-line bg-surface px-4 py-3 outline-none focus:border-accent";

// Пока только визуальная часть: данные никуда не отправляются.
export function SignupForm() {
  const [level, setLevel] = useState<Level>("beginner");
  const [contact, setContact] = useState<Contact>("telegram");
  const [sent, setSent] = useState(false);
  const contactMeta = contacts.find((item) => item.id === contact) ?? contacts[0];

  if (sent) {
    return (
      <div className="rounded-card border border-accent bg-accent-soft p-8 text-center">
        <h3 className="font-heading text-2xl font-bold">Заявка отправлена</h3>
        <p className="mt-3 text-ink-muted">Спасибо! Мы свяжемся с вами выбранным способом.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
      className="flex flex-col gap-6 rounded-card border border-line bg-surface p-6 shadow-card sm:p-8"
    >
      <label className="flex flex-col gap-2">
        <span className="font-semibold">Имя</span>
        <input name="name" required autoComplete="name" className={fieldClass} />
      </label>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 font-semibold">Уровень</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {levels.map((item) => (
            <label key={item.id} className="cursor-pointer">
              <input
                type="radio"
                name="level"
                value={item.id}
                checked={level === item.id}
                onChange={() => setLevel(item.id)}
                className="peer sr-only"
              />
              <span className="flex items-center justify-between rounded-control border border-line px-4 py-3 peer-checked:border-accent peer-checked:bg-accent-soft">
                <span className="font-semibold">{item.label}</span>
                <span className="text-ink-muted">{item.price}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 font-semibold">Как с вами связаться</legend>
        <div className="flex flex-wrap gap-2">
          {contacts.map((item) => (
            <label key={item.id} className="cursor-pointer">
              <input
                type="radio"
                name="contactType"
                value={item.id}
                checked={contact === item.id}
                onChange={() => setContact(item.id)}
                className="peer sr-only"
              />
              <span className="inline-block rounded-pill border border-line px-4 py-2 peer-checked:border-accent peer-checked:bg-accent peer-checked:text-on-accent">
                {item.label}
              </span>
            </label>
          ))}
        </div>
        <input
          name="contact"
          required
          placeholder={contactMeta.placeholder}
          className={fieldClass}
          aria-label={contactMeta.label}
        />
      </fieldset>

      <label className="flex flex-col gap-2">
        <span className="font-semibold">Комментарий (необязательно)</span>
        <textarea name="comment" rows={3} className={fieldClass} />
      </label>

      <label className="flex items-start gap-3 text-sm text-ink-muted">
        <input type="checkbox" required className="mt-1 size-4 shrink-0" />
        <span>
          Согласен на обработку персональных данных и с условиями{" "}
          <a href="https://yarchinvest.ru/offer" className="text-accent underline">
            публичной оферты
          </a>
          .
        </span>
      </label>

      <button
        type="submit"
        className="rounded-control bg-accent px-6 py-3 text-base font-semibold text-on-accent transition-colors hover:bg-accent-hover"
      >
        Отправить заявку
      </button>
    </form>
  );
}
