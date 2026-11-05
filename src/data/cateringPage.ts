// Page copy for /catering. Unlike the dishes and prices (which live in the
// database), this text stays in the code.

export const cateringHero = {
  slogans: ["Japanese-inspired catering for your events", "Your event. Our passion."],
  description:
    "Планирате събитие? Ние ще се погрижим за храната, сервирането и цялостното обслужване, за да бъде вашето събитие незабравимо.",
};

export const cateringHighlights = [
  { id: "japanese-cuisine", label: "Японска кухня" },
  { id: "professional-staff", label: "Професионален персонал" },
  { id: "fresh-quality", label: "Прясно & качествено" },
  { id: "full-service", label: "Пълно обслужване по ваш избор" },
] as const;

export const eventTypes = [
  { id: "private", label: "Private Events", labelBg: "Частни събития" },
  { id: "corporate", label: "Corporate Events", labelBg: "Фирмени събития" },
  { id: "birthdays", label: "Birthdays & Celebrations", labelBg: "Рождени дни и тържества" },
  { id: "openings", label: "Openings & Cocktails", labelBg: "Откривания и коктейли" },
] as const;

export type PackageTier = {
  id: string;
  name: string;
  description: string;
  includes: string[];
  priceNote: string;
  minGuestsNote: string;
};

// Tier names and inclusions are placeholders for the client to refine.
// Numbers are deliberately omitted until real pricing is provided.
export const packageTiers: PackageTier[] = [
  {
    id: "bazov",
    name: "Базов",
    description: "Компактно предложение за по-малки, неформални събирания.",
    includes: ["Предястия", "Основно ястие", "Напитки"],
    priceNote: "уточнява се по телефона",
    minGuestsNote: "уточнява се по телефона",
  },
  {
    id: "standarten",
    name: "Стандартен",
    description: "Разширено меню с повече опции — най-търсеният вариант.",
    includes: ["Предястия", "Основно ястие", "Десерт", "Напитки"],
    priceNote: "уточнява се по телефона",
    minGuestsNote: "уточнява се по телефона",
  },
  {
    id: "premium",
    name: "Премиум",
    description: "Пълно обслужване с разширено меню и сервитьори на място.",
    includes: ["Предястия", "Основно ястие", "Десерт", "Напитки", "Сервитьори на място"],
    priceNote: "уточнява се по телефона",
    minGuestsNote: "уточнява се по телефона",
  },
];

export const cateringFaq = [
  {
    question: "Кога трябва да подам заявка предварително?",
    answer:
      "Колкото по-рано, толкова по-добре — така можем спокойно да съгласуваме дата, меню и брой гости. Свържете се с нас, за да уточним конкретния срок за вашето събитие.",
  },
  {
    question: "В какъв радиус доставяте?",
    answer:
      "Зоната на доставка и евентуална такса извън определен радиус се уточняват индивидуално — обадете ни се и ни кажете адреса на събитието.",
  },
  {
    question: "Осигурявате ли сервитьори и оборудване?",
    answer:
      "Да, в зависимост от избрания пакет и типа събитие можем да осигурим сервитьори и необходимото оборудване — вижте пакетите по-горе или ни попитайте директно.",
  },
  {
    question: "Има ли минимален брой гости за поръчка?",
    answer:
      "Минималният брой гости зависи от пакета и вида събитие — ще го уточним заедно по телефона.",
  },
] as const;
