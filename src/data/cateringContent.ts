// Content for the /catering page. Copy in `hero`, `highlights` and
// `eventTypes` is drawn from the MAKA CATERING flyer supplied in the brief
// (section 5.1) and can be pasted over verbatim once the client shares the
// flyer file itself.
//
// The brief (sections 5.2, 5.3, 9) is explicit that a real catering price
// list and dish catalogue are still to come from the client and that
// catering must not just reuse the restaurant menu's own prices verbatim.
// Per an explicit call from the project owner, `cateringMenuCategories`
// below is seeded with real restaurant dishes at a flat markup (see
// src/lib/cateringPricing.ts) as a working placeholder — clearly not the
// client's real catering price list, but enough to make the page
// functional instead of empty. `packageTiers` stays priceless ("по
// запитване") since a package price isn't a simple markup of one dish.
// Swap either wholesale once the client sends real catering data — no
// other file needs to change.

import type { MenuItem } from "./types";
import { cateringPriceFrom } from "@/lib/cateringPricing";
import { stockImages } from "@/lib/stockImages";

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

// Example structure per brief 5.2 ("напр. Базов / Стандартен / Премиум").
// Tier names/inclusions are placeholders for the client to refine —
// numbers are deliberately omitted until real pricing is provided.
export const packageTiers: PackageTier[] = [
  {
    id: "bazov",
    name: "Базов",
    description: "Компактно предложение за по-малки, неформални събирания.",
    includes: ["Предястия", "Основно ястие", "Напитки"],
    priceNote: "по запитване",
    minGuestsNote: "по запитване",
  },
  {
    id: "standarten",
    name: "Стандартен",
    description: "Разширено меню с повече опции — най-търсеният вариант.",
    includes: ["Предястия", "Основно ястие", "Десерт", "Напитки"],
    priceNote: "по запитване",
    minGuestsNote: "по запитване",
  },
  {
    id: "premium",
    name: "Премиум",
    description: "Пълно обслужване с разширено меню и сервитьори на място.",
    includes: ["Предястия", "Основно ястие", "Десерт", "Напитки", "Сервитьори на място"],
    priceNote: "по запитване",
    minGuestsNote: "по запитване",
  },
];

// Own internal navigation for the catering menu, organised by event/serving
// logic per brief 5.3 — distinct from the restaurant's dish-type tabs.
//
// Items below are the restaurant's real, confirmed dishes (name/description/
// allergens copied verbatim from src/data/restaurantMenu.ts) re-priced with
// CATERING_MARKUP via cateringPriceFrom() — see src/lib/cateringPricing.ts
// for why. There are no desserts on the restaurant menu to draw from, so
// "Десерти" stays empty rather than inventing dishes; "Пакети за фирмени
// партита" points back at the package tiers above instead of duplicating
// items, since it's a bundling concept, not a dish list.
export const cateringMenuCategories: {
  id: string;
  name: string;
  note?: string;
  imageUrl?: string;
  imageAlt?: string;
  items: MenuItem[];
}[] = [
  {
    id: "topli-predyastiya",
    name: "Топли предястия",
    imageUrl: stockImages["catering-topli-predyastiya"].url,
    imageAlt: stockImages["catering-topli-predyastiya"].alt,
    items: [
      {
        id: "cat-edamame",
        name: "Едамаме на пара",
        vegetarian: true,
        allergens: [4],
        description: "Посолено или пикантно",
        ...cateringPriceFrom(3.5, 6.84),
      },
      {
        id: "cat-gyoza",
        name: "Домашна Гьоза",
        vegetarian: true,
        allergens: [1, 4, 9],
        description: "Месна или вегетарианска",
        portion: "6бр",
        ...cateringPriceFrom(8, 15.65),
      },
      {
        id: "cat-dak-gang-jong",
        name: "Дак Ганг Джонг",
        allergens: [4, 9],
        description: "Корейски люти пилешки хапки",
        ...cateringPriceFrom(9, 17.6),
      },
      {
        id: "cat-torpedo-skaridi",
        name: "Торпедо скариди",
        allergens: [6, 9],
        description: "Хрупкави панирани скариди с люта майонеза",
        ...cateringPriceFrom(8, 15.65),
      },
    ],
  },
  {
    id: "studeni-predyastiya",
    name: "Студени предястия",
    imageUrl: stockImages["catering-studeni-predyastiya"].url,
    imageAlt: stockImages["catering-studeni-predyastiya"].alt,
    items: [
      {
        id: "cat-tsukimono",
        name: "Тсукимоно салата",
        vegetarian: true,
        allergens: [9],
        description: "Микс маринован сезонни зеленчуци",
        ...cateringPriceFrom(5, 9.78),
      },
    ],
  },
  {
    id: "tabli-bufeti",
    name: "Кетъринг табли и бюфети",
    note: "Поке купите се предлагат и като общи табли за самообслужване.",
    imageUrl: stockImages["catering-tabli-bufeti"].url,
    imageAlt: stockImages["catering-tabli-bufeti"].alt,
    items: [
      {
        id: "cat-glazirano-svinsko",
        name: "Глазирано Свинско (поке)",
        allergens: [1, 4, 5, 9],
        description: "Глазирани свински гърди, сладка царевица, едамаме, мариновано зеле, поке сос, суши ориз",
        ...cateringPriceFrom(11, 21.51),
      },
      {
        id: "cat-pile-teriyaki",
        name: "Пиле терияки (поке)",
        allergens: [1, 4, 9],
        description: "Терияки пиле, краставица, едамаме, морков, мариновано зеле, сусам, поке сос, суши ориз",
        ...cateringPriceFrom(11, 21.51),
      },
      {
        id: "cat-pikantna-somga",
        name: "Пикантна сьомга (поке)",
        allergens: [2, 3, 4, 5, 9],
        description: "Сашими пикантна сьомга, краставица, едамаме, манго, авокадо, поке сос, суши ориз",
        ...cateringPriceFrom(12, 23.47),
      },
      {
        id: "cat-vegan-poke",
        name: "Веган (поке)",
        vegetarian: true,
        allergens: [1, 4, 6, 9],
        description: "Сотирани зеленчуци, мариновано зеле, авокадо, чери домати, едамаме, веган сос, суши ориз",
        ...cateringPriceFrom(11, 21.51),
      },
      {
        id: "cat-kbbq-svinsko",
        name: "Корейско барбекю — свинско месо",
        description: "Сервирано на табла със сосове, гарнитури и маруля",
        ...cateringPriceFrom(20, 39.12),
      },
      {
        id: "cat-kbbq-svinsko-teleshko",
        name: "Корейско барбекю — свинско + телешко",
        description: "Сервирано на табла със сосове, гарнитури и маруля",
        ...cateringPriceFrom(25, 48.9),
      },
    ],
  },
  {
    id: "deserti",
    name: "Десерти",
    note: "Предстои — в момента ресторантското меню не включва десерти, от които да изчислим ориентировъчни цени.",
    items: [],
  },
  {
    id: "napitki",
    name: "Напитки",
    imageUrl: stockImages["catering-napitki"].url,
    imageAlt: stockImages["catering-napitki"].alt,
    items: [
      {
        id: "cat-mineralna-voda",
        name: "Минерална вода",
        portion: "500мл",
        ...cateringPriceFrom(1.5, 2.93),
      },
      {
        id: "cat-domashna-limonada",
        name: "Домашна лимонада",
        portion: "350мл",
        ...cateringPriceFrom(3.5, 6.84),
      },
      {
        id: "cat-naturalen-sok",
        name: "Натурален сок",
        portion: "250мл",
        ...cateringPriceFrom(2, 3.91),
      },
      {
        id: "cat-kokakola",
        name: "Кока-кола / зиро / Фанта",
        portion: "330мл",
        ...cateringPriceFrom(2, 3.91),
      },
      {
        id: "cat-nalivna-bira",
        name: "Наливна Бира",
        portion: "330мл",
        ...cateringPriceFrom(3.5, 6.84),
      },
      {
        id: "cat-vino-na-chasha",
        name: "Вино на чаша",
        ...cateringPriceFrom(5, 9.78),
      },
      {
        id: "cat-late",
        name: "Лате",
        portion: "250мл",
        ...cateringPriceFrom(3, 5.87),
      },
      {
        id: "cat-espreso",
        name: "Еспресо",
        portion: "30мл",
        ...cateringPriceFrom(2, 3.91),
      },
    ],
  },
  {
    id: "firmeni-partita",
    name: "Пакети за фирмени партита",
    note: "Вижте готовите пакети по-горе — комбинираме предястия, основни ястия, напитки и обслужване в едно предложение за вашето фирмено парти.",
    items: [],
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
      "Зоната на доставка и евентуална такса извън определен радиус се уточняват индивидуално при запитването — обадете ни се или изпратете формата с адреса на събитието.",
  },
  {
    question: "Осигурявате ли сервитьори и оборудване?",
    answer:
      "Да, в зависимост от избрания пакет и типа събитие можем да осигурим сервитьори и необходимото оборудване — вижте пакетите по-горе или ни попитайте директно.",
  },
  {
    question: "Има ли минимален брой гости за поръчка?",
    answer:
      "Минималният брой гости зависи от пакета и вида събитие — ще го уточним заедно, след като получим вашето запитване.",
  },
] as const;
