import { Container } from "./container";

export function SiteFooter() {
  return (
    <footer className="scene-dark">
      <Container className="flex flex-col gap-6 py-10 sm:py-12">
        <div className="font-heading text-xl font-bold">Ярчинвест</div>
        <div className="flex flex-col gap-2 text-sm opacity-80 sm:flex-row sm:gap-6">
          <a href="https://yarchinvest.online/cabinet.html" className="hover:opacity-100">
            Личный кабинет
          </a>
          <a href="https://yarchinvest.ru/offer" className="hover:opacity-100">
            Оферта
          </a>
          <a href="https://yarchinvest.ru/privacy" className="hover:opacity-100">
            Политика конфиденциальности
          </a>
        </div>
        <p className="text-sm opacity-60">© 2026 ООО «Стормикс», ИНН 3700002256</p>
      </Container>
    </footer>
  );
}
