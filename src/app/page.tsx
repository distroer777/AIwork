import { ButtonLink } from "@/components/button";
import { Card } from "@/components/card";
import { Container } from "@/components/container";
import { CourseCard } from "@/components/course-card";
import { CycleSteps } from "@/components/cycle-steps";
import { FaqItem } from "@/components/faq-item";
import { LogicCard } from "@/components/logic-card";
import { PortfolioWidget } from "@/components/portfolio-widget";
import { ProgramTabs } from "@/components/program-tabs";
import { Section } from "@/components/section";
import { SignupForm } from "@/components/signup-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Stat } from "@/components/stat";
import { StoryCard } from "@/components/story-card";

const heroStats = [
  { value: "8", label: "модулей, полный цикл за 4 недели" },
  { value: "1 000 000 ₽", label: "учебный портфель" },
  { value: "7", label: "классов активов: от депозитов до крипты и деривативов" },
  { value: "от 10 000 ₽", label: "капитал для практики" },
];

const withoutSystem = [
  "Совет друга",
  "Увиденный обзор",
  "Предложение банка",
  "Покупка на просадке",
  "Продажа из страха",
];

const withSystem = [
  "Критерии под вашу цель",
  "Условие пересмотра задано при покупке",
  "Риск определён заранее",
  "Решение можно объяснить",
  "Единый портфель",
];

const cycle = [
  { title: "Цель", text: "Зачем вы инвестируете и на какой срок." },
  { title: "Анализ", text: "Что известно об инструменте, а что нет." },
  { title: "Решение", text: "Купить, продать или подождать, и почему." },
  { title: "Риск", text: "Сколько вы готовы потерять, определено заранее." },
  { title: "Результат", text: "Что получилось на самом деле." },
  { title: "Пересмотр", text: "Выводы и возврат к цели." },
];

const trainerSteps = [
  "Собираете портфель с нуля",
  "Следите за структурой и результатом",
  "Меняете решения и видите последствия",
];

const allocation = [
  { label: "Акции", percent: 34 },
  { label: "Облигации", percent: 26 },
  { label: "Фонды", percent: 22 },
  { label: "Деньги", percent: 18 },
];

const tracks = [
  {
    id: "beginner",
    label: "Начинающий",
    modules: [
      { title: "Вводное занятие", text: "Как устроен рынок и курс, цели и риски." },
      { title: "Депозиты", text: "Вклады, ставка и инфляция как точка отсчёта." },
      { title: "Облигации", text: "Купон, доходность и риски долговых бумаг." },
      { title: "Золото", text: "Роль золота в портфеле и способы вложения." },
      { title: "Акции: фундаментальный анализ", text: "Как оценивать бизнес компании." },
      { title: "Акции: технический анализ", text: "Графики, тренды и их пределы." },
      { title: "Криптовалюты", text: "Как устроены цифровые активы и их риски." },
      { title: "Заключительное занятие", text: "Итоговый портфель и план действий." },
    ],
  },
  {
    id: "practitioner",
    label: "Практикующий",
    modules: [
      { title: "Депозиты", text: "Вклады, ставка и инфляция как точка отсчёта." },
      { title: "Облигации", text: "Купон, доходность и риски долговых бумаг." },
      { title: "Золото", text: "Роль золота в портфеле и способы вложения." },
      { title: "Акции: фундаментальный анализ", text: "Как оценивать бизнес компании." },
      { title: "Акции: технический анализ", text: "Графики, тренды и их пределы." },
      { title: "Фьючерсы", text: "Как работают срочные контракты и плечо." },
      { title: "Криптовалюты", text: "Как устроены цифровые активы и их риски." },
      { title: "ЦФА", text: "Цифровые финансовые активы и работа с ними." },
    ],
  },
];

const stories = [
  {
    before: "Держал всё на депозите и боялся биржи.",
    after: "Объясняет каждую свою покупку.",
  },
  {
    before: "Покупал по обзорам и продавал на просадках.",
    after: "Проверяет чужие идеи по своим критериям.",
  },
  {
    before: "Держал 12 случайных акций.",
    after: "Принимает решения самостоятельно.",
  },
];

const shared = [
  "8 модулей и конспекты",
  "Учебный портфель",
  "Задания с обратной связью",
  "Консультация после каждого модуля",
  "Личный кабинет и чат участников",
];

const faq = [
  {
    q: "Сколько длится занятие?",
    a: "Это видео по 8–15 минут и конспект. Модуль целиком занимает около 1,5–2 часов.",
  },
  {
    q: "Как открываются модули?",
    a: "По порядку. Следующий модуль открывается, когда вы изучили материалы текущего и задание принято.",
  },
  {
    q: "Можно ли учиться в своём темпе?",
    a: "Да. Пропущенные недели не приводят к отчислению.",
  },
  {
    q: "Почему «4 недели»?",
    a: "Это рекомендуемый темп: два модуля в неделю. Доступ к материалам сохраняется на год.",
  },
  {
    q: "Где хранятся материалы?",
    a: "В личном кабинете, весь период доступа.",
  },
  {
    q: "Что происходит после оплаты?",
    a: "Вы регистрируетесь, в течение нескольких часов мы подтверждаем доступ и присылаем письмо с данными для входа.",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="bg-bg">
          <Container className="py-14 sm:py-20 lg:py-28">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-accent">
              Онлайн-курс по инвестициям
            </p>
            <h1 className="max-w-4xl font-heading text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              Инвестиции, где вы понимаете <em className="text-accent">каждое решение</em>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-ink-muted sm:text-xl">
              Никаких советов, что купить. За 4 недели вы построите систему принятия решений и проверите её на
              учебном портфеле в 1 000 000 ₽.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="#join">Начать обучение</ButtonLink>
              <ButtonLink href="#method" variant="secondary">
                Посмотреть, как устроен курс
              </ButtonLink>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {heroStats.map((stat) => (
                <Stat key={stat.label} value={stat.value} label={stat.label} />
              ))}
            </div>
          </Container>
        </section>

        <Section id="idea" eyebrow="Две логики" title="Без системы и по системе" tone="surface">
          <div className="grid gap-6 md:grid-cols-2">
            <LogicCard variant="without" title="Без системы" items={withoutSystem} />
            <LogicCard variant="with" title="По системе" items={withSystem} />
          </div>
          <div className="mt-6 rounded-card bg-ink p-6 text-on-ink sm:p-8">
            <p className="font-heading text-xl font-bold">Проблема не в конкретной акции</p>
            <p className="mt-2 opacity-80">Проблема в том, что нет системы, по которой принимаются решения.</p>
          </div>
        </Section>

        <Section
          id="method"
          eyebrow="Идея курса"
          title="Система — это один цикл, который повторяется"
          subtitle="Как лента Мёбиуса: у цикла нет конца. После пересмотра вы возвращаетесь к цели, но уже с новым опытом."
        >
          <CycleSteps steps={cycle} />
        </Section>

        <Section
          id="trainer"
          eyebrow="Инвестиционный тренажёр"
          title="Первые ошибки лучше сделать не на своих деньгах"
          tone="surface"
        >
          <div className="grid items-start gap-8 lg:grid-cols-2">
            <div>
              <ol className="flex flex-col gap-4">
                {trainerSteps.map((step, index) => (
                  <li key={step} className="flex items-center gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-pill bg-accent-soft font-heading font-bold text-accent">
                      {index + 1}
                    </span>
                    <span className="text-lg font-semibold">{step}</span>
                  </li>
                ))}
              </ol>
              <ButtonLink href="#join" className="mt-8 w-full sm:w-auto">
                Собрать портфель
              </ButtonLink>
              <p className="mt-4 text-sm text-ink-muted">
                Акции, облигации, фонды и фьючерсы Мосбиржи по реальным котировкам.
              </p>
            </div>
            <PortfolioWidget capital="1 000 000 ₽" today="+1,4%" total="+4,3%" allocation={allocation} />
          </div>
        </Section>

        <Section
          id="program"
          eyebrow="Программа"
          title="8 модулей: одна система, которая постепенно усложняется"
        >
          <ProgramTabs tracks={tracks} />
        </Section>

        <Section id="author" eyebrow="Автор курса" title="Владимир Ярченков" tone="surface">
          <div className="grid items-start gap-8 lg:grid-cols-2">
            <div>
              <blockquote className="font-heading text-xl font-bold leading-snug sm:text-2xl">
                Я не скажу вам, что покупать. Я покажу, как принимать решение.
              </blockquote>
              <p className="mt-6 text-lg text-ink-muted">
                Ставка на метод, а не на прогнозы. Инвестирует с 2018 года, включая свои ошибки.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <Stat value="8 лет" label="на рынке со своими деньгами" />
                <Stat value="25+" label="выпускников" />
              </div>
            </div>
            <div className="rounded-card border border-line bg-bg p-6 sm:p-8">
              <p className="text-sm text-ink-muted">Личный портфель автора, 2019–2026</p>
              <p className="mt-2 font-heading text-4xl font-bold text-accent sm:text-5xl">+45%</p>
              <p className="mt-1 font-semibold">среднегодовая доходность</p>
              <p className="mt-4 text-sm text-ink-muted">
                Собственный расчёт автора. Прошлая доходность не гарантирует будущую.
              </p>
            </div>
          </div>
        </Section>

        <Section id="stories" eyebrow="Истории участников" title="Было и стало">
          <div className="grid gap-4 md:grid-cols-3">
            {stories.map((story) => (
              <StoryCard key={story.before} before={story.before} after={story.after} />
            ))}
          </div>
          <p className="mt-8 max-w-2xl text-lg text-ink-muted">
            Никаких сигналов, готовых портфелей и гарантий доходности. Только система.
          </p>
        </Section>

        <Section id="pricing" eyebrow="Стоимость" title="Два образовательных маршрута" tone="surface">
          <Card title="В обоих маршрутах" className="mb-6 bg-bg shadow-none">
            <ul className="grid gap-2 sm:grid-cols-2">
              {shared.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 size-2 shrink-0 rounded-pill bg-accent" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
          <div className="grid gap-6 lg:grid-cols-2">
            <CourseCard
              featured
              title="Начинающий"
              price="20 000 ₽"
              access="Доступ на год"
              lead="Основы и первый портфель."
              points={[
                "Открытие брокерского счёта",
                "Депозиты, облигации, золото, акции, крипта",
              ]}
              cta="Начать с «Начинающего»"
            />
            <CourseCard
              title="Практикующий"
              price="35 000 ₽"
              access="Бессрочный доступ"
              lead="Углублённый анализ."
              points={[
                "Фьючерсы и хеджирование",
                "Разбор вашего текущего портфеля",
                "Индивидуальная консультация",
                "Чек-лист перед сделкой",
                "Шаблон личного бюджета",
                "Шаблоны портфеля и журнала решений",
              ]}
              cta="Выбрать «Практикующий»"
            />
          </div>
          <p className="mt-6 text-ink-muted">Есть и очный формат в Иванове.</p>
          <p className="mt-6 max-w-3xl text-sm text-ink-muted">
            Инвестиции связаны с риском. Прошлая доходность не гарантирует будущую. Курс является образованием
            и не является индивидуальной инвестиционной рекомендацией.
          </p>
        </Section>

        <Section id="join" eyebrow="Заявка" title="Следующее решение уже за вами">
          <div className="max-w-2xl">
            <SignupForm />
          </div>
        </Section>

        <Section id="faq" eyebrow="Вопросы и ответы" title="Частые вопросы" tone="surface">
          <div className="flex max-w-3xl flex-col gap-3">
            {faq.map((item) => (
              <FaqItem key={item.q} question={item.q}>
                {item.a}
              </FaqItem>
            ))}
          </div>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
