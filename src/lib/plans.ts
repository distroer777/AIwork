export type PlanId = "FREE" | "PRO";

export type PlanConfig = {
  id: PlanId;
  name: string;
  price: string;
  /** null: без ограничения */
  drafts: number | null;
  rewritesPerMonth: number | null;
  features: string[];
};

// Все лимиты тарифов в одном месте
export const PLANS: Record<PlanId, PlanConfig> = {
  FREE: {
    id: "FREE",
    name: "Free",
    price: "0 ₽",
    drafts: 3,
    rewritesPerMonth: 5,
    features: [
      "До 3 черновиков",
      "До 5 переписываний с AI в месяц",
      "Фото и видео в черновиках",
      "Три формата: исходный, короткий, лонгрид",
    ],
  },
  PRO: {
    id: "PRO",
    name: "Pro",
    price: "499 ₽ в месяц",
    drafts: null,
    rewritesPerMonth: null,
    features: [
      "Черновики без ограничений",
      "Переписывания с AI без ограничений",
      "Фото и видео в черновиках",
      "Три формата: исходный, короткий, лонгрид",
    ],
  },
};
