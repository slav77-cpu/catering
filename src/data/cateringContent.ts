// SEED SOURCE ONLY (prisma/seed.ts) — the site reads the catering menu from the
// database. Page copy for /catering lives in src/data/cateringPage.ts.
//
// Items are the restaurant's real, confirmed dishes re-priced with
// CATERING_MARKUP via cateringPriceFrom() — a working placeholder until the
// client sends a real catering price list (see src/lib/cateringPricing.ts).
// There are no desserts on the restaurant menu to draw from, so "Десерти" stays
// empty rather than inventing dishes; "Пакети за фирмени партита" points at the
// package tiers instead of duplicating items.

import type { MenuItem } from "./types";
import { cateringPriceFrom } from "@/lib/cateringPricing";

export const cateringMenuCategories: {
  id: string;
  name: string;
  note?: string;
  items: MenuItem[];
}[] = [
  {
    id: "topli-predyastiya",
    name: "Топли предястия",
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
