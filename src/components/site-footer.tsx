import Link from "next/link";
import { Container } from "./container";
import { COMPANY, requisitesLines } from "@/lib/company";

const documents = [
  { href: "/legal/terms", label: "Пользовательское соглашение" },
  { href: "/legal/privacy", label: "Политика конфиденциальности" },
  { href: "/legal/consent", label: "Согласие на обработку данных" },
  { href: "/legal/offer", label: "Оферта" },
];

export function SiteFooter() {
  return (
    <footer className="scene-dark">
      <Container className="grid gap-8 py-10 sm:py-12 md:grid-cols-3">
        <div className="flex flex-col gap-3">
          <div className="font-heading text-xl font-bold">Ярчинвест</div>
          <Link href="/login" className="text-sm opacity-80 hover:opacity-100">
            Личный кабинет
          </Link>
          <a href={`mailto:${COMPANY.email}`} className="text-sm opacity-80 hover:opacity-100">
            {COMPANY.email}
          </a>
          {COMPANY.phone ? (
            <a href={`tel:${COMPANY.phone}`} className="text-sm opacity-80 hover:opacity-100">
              {COMPANY.phone}
            </a>
          ) : null}
        </div>
        <nav className="flex flex-col gap-2 text-sm" aria-label="Документы">
          <span className="font-semibold">Документы</span>
          {documents.map((doc) => (
            <Link key={doc.href} href={doc.href} className="opacity-80 hover:opacity-100">
              {doc.label}
            </Link>
          ))}
          <Link href="/legal" className="opacity-80 hover:opacity-100">
            Все документы
          </Link>
        </nav>
        <div className="flex flex-col gap-1 text-sm opacity-80">
          <span className="font-semibold opacity-100">Реквизиты</span>
          {requisitesLines().map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>
      </Container>
      <Container className="pb-8">
        <p className="text-sm opacity-60">© 2026 {COMPANY.name}</p>
      </Container>
    </footer>
  );
}
