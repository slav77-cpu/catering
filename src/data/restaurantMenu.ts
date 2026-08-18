import type { Allergen, MenuCategory } from "./types";

// Transcribed verbatim from "Приложение А: Реално меню на ресторанта
// (MAKA RAMEN)" in the client brief. Prices are given in EUR / BGN in the
// source (Bulgaria is transitioning to the euro) — both are shown on site.

export const allergenLegend: Allergen[] = [
  { code: 1, name: "Глутен" },
  { code: 2, name: "Яйчни продукти" },
  { code: 3, name: "Рибни продукти" },
  { code: 4, name: "Соя" },
  { code: 5, name: "Лактоза" },
  { code: 6, name: "Дървесни ядки" },
  { code: 7, name: "Целина" },
  { code: 8, name: "Синап и горчица" },
  { code: 9, name: "Сусам" },
  { code: 10, name: "Ракообразни" },
  { code: 11, name: "Мекотели" },
];

export const restaurantMenu: MenuCategory[] = [
  {
    id: "ramen",
    name: "Рамен",
    items: [
      {
        id: "tonkotsu-shoyu",
        name: "Тонкоцу Шою",
        allergens: [1, 2, 3, 4, 9],
        description:
          "Свински бульон, Шою таре, пресни нудли, свинско Чашу, гъби, водорасло нори, мариновано яйце, зелен лук",
        portion: "600г",
        priceEur: 12,
        priceBgn: 23.47,
      },
      {
        id: "teleshki",
        name: "Телешки",
        allergens: [1, 3, 4, 9],
        description:
          "Телешки бульон, Шою таре, пресни нудли, дърпано телешко, гъби, мариновон лук, водорасло нори, зелен лук",
        portion: "600г",
        priceEur: 13,
        priceBgn: 25.42,
      },
      {
        id: "massaman",
        name: "Массаман",
        allergens: [1, 2, 4, 9],
        description:
          "Лют пилешки бульон в массаман стил, Мисо таре, пресни нудли, Муненику пиле, сладка царевица, мариновано халапеньо, водорасло нори, мариновано яйце, зелен лук",
        portion: "600г",
        priceEur: 12,
        priceBgn: 23.47,
      },
      {
        id: "veji",
        name: "Веджи",
        vegetarian: true,
        allergens: [1, 4, 7, 9],
        description:
          "Лек и ароматен зеленчуков бульон, пресни нудли, Мисо таре, гриловани сезонни зеленчуци, едамаме, гъби, водорасло нори, зелен лук",
        portion: "600г",
        priceEur: 11,
        priceBgn: 21.51,
      },
    ],
  },
  {
    id: "predyastiya",
    name: "Предястия",
    items: [
      {
        id: "edamame",
        name: "Едамаме на пара",
        vegetarian: true,
        allergens: [4],
        description: "Посолено или пикантно",
        portion: "200г",
        priceEur: 3.5,
        priceBgn: 6.84,
      },
      {
        id: "gyoza",
        name: "Домашна Гьоза",
        vegetarian: true,
        allergens: [1, 4, 9],
        description: "Месна или вегетарианска",
        portion: "6бр",
        priceEur: 8,
        priceBgn: 15.65,
      },
      {
        id: "tsukimono",
        name: "Тсукимоно салата",
        vegetarian: true,
        allergens: [9],
        description: "Микс маринован сезонни зеленчуци",
        portion: "200г",
        priceEur: 5,
        priceBgn: 9.78,
      },
      {
        id: "dak-gang-jong",
        name: "Дак Ганг Джонг",
        allergens: [4, 9],
        description: "Корейски люти пилешки хапки",
        portion: "250г",
        priceEur: 9,
        priceBgn: 17.6,
      },
      {
        id: "torpedo-skaridi",
        name: "Торпедо скариди",
        allergens: [6, 9],
        description: "Хрупкави панирани скариди с люта майонеза",
        portion: "150г",
        priceEur: 8,
        priceBgn: 15.65,
      },
    ],
  },
  {
    id: "dobavki",
    name: "Добавки",
    items: [
      { id: "marinovano-yaytse", name: "Мариновано яйце", portion: "60г", priceEur: 1.5, priceBgn: 2.93 },
      { id: "sushi-oriz", name: "Суши ориз", portion: "150г", priceEur: 2.5, priceBgn: 4.89 },
      { id: "nudli", name: "Нудли", portion: "180г", priceEur: 3, priceBgn: 5.87 },
      { id: "dopalnitelno-meso", name: "Допълнително месо", portion: "140г", priceEur: 3, priceBgn: 5.87 },
      { id: "sladka-tsarevitsa", name: "Сладка царевица", portion: "60г", priceEur: 1, priceBgn: 1.96 },
      { id: "grilovani-zelenchutsi", name: "Гриловани зеленчуци", portion: "180г", priceEur: 3, priceBgn: 5.87 },
    ],
  },
  {
    id: "poke",
    name: "Поке",
    items: [
      {
        id: "glazirano-svinsko",
        name: "Глазирано Свинско",
        allergens: [1, 4, 5, 9],
        description:
          "Глазирани свински гърди, сладка царевица, едамаме, мариновано зеле, мариновон лук, поке сос, суши ориз",
        portion: "450г",
        priceEur: 11,
        priceBgn: 21.51,
      },
      {
        id: "pile-teriyaki",
        name: "Пиле терияки",
        allergens: [1, 4, 9],
        description:
          "Терияки пиле, краставица, едамаме, морков, мариновано зеле, сусам, зелен лук, поке сос, суши ориз",
        portion: "450г",
        priceEur: 11,
        priceBgn: 21.51,
      },
      {
        id: "pikantna-somga",
        name: "Пикантна сьомга",
        allergens: [2, 3, 4, 5, 9],
        description:
          "Сашими пикантна сьомга, краставица, едамаме, манго, авокадо, мариновано халапеньо, поке сос, суши ориз",
        portion: "450г",
        priceEur: 12,
        priceBgn: 23.47,
      },
      {
        id: "vegan-poke",
        name: "Веган",
        vegetarian: true,
        allergens: [1, 4, 6, 9],
        description:
          "Сотирани зеленчуци, мариновано зеле, авокадо, чери домати, едамаме, сусам, веган сос, суши ориз",
        portion: "450г",
        priceEur: 11,
        priceBgn: 21.51,
      },
    ],
  },
  {
    id: "koreysko-barbekyu",
    name: "Корейско Барбекю",
    note: "Задължителна резервация един ден по-рано.",
    items: [
      {
        id: "kbbq-svinsko",
        name: "Свинско месо",
        description: "Включва сосове, гарнитури, маруля",
        priceEur: 20,
        priceBgn: 39.12,
      },
      {
        id: "kbbq-svinsko-teleshko",
        name: "Свинско + телешко",
        description: "Включва сосове, гарнитури, маруля",
        priceEur: 25,
        priceBgn: 48.9,
      },
    ],
  },
  {
    id: "vina",
    name: "Вина",
    note: "Вино на чаша — 5€ / 9.78лв",
    subgroups: [
      {
        id: "byalo",
        name: "Бяло вино",
        items: [
          { id: "medi-valley-sauvignon-a-good-year", name: "MEDI VALLEY A Good Year, Sauvignon Blanc / Bulgaria", priceEur: 20, priceBgn: 39.11 },
          { id: "medi-valley-sauvignon-excentric", name: "MEDI VALLEY Excentric Incanto, Sauvignon Blanc / Bulgaria", priceEur: 22, priceBgn: 43.03 },
          { id: "dragomir-sarva-dimyat", name: "DRAGOMIR Sarva, Dimyat / Bulgaria", priceEur: 27, priceBgn: 52.8 },
        ],
      },
      {
        id: "roze",
        name: "Вино розе",
        items: [
          { id: "medi-valley-rose-a-good-year", name: "MEDI VALLEY A Good Year, Rose / Bulgaria", priceEur: 21, priceBgn: 41.07 },
          { id: "medi-valley-rose-excentric", name: "MEDI VALLEY Excentric Incanto, Rose / Bulgaria", priceEur: 22, priceBgn: 43.03 },
          { id: "dragomir-sarva-rose", name: "DRAGOMIR Sarva, Rose / Bulgaria", priceEur: 27, priceBgn: 52.8 },
          { id: "enira-rose", name: "Enira, Rose / Bulgaria", priceEur: 29, priceBgn: 56.72 },
        ],
      },
      {
        id: "cherveno",
        name: "Червено вино",
        items: [
          { id: "medi-valley-merlot-a-good-year", name: "MEDI VALLEY A Good Year, Merlot / Bulgaria", priceEur: 20, priceBgn: 39.11 },
          { id: "medi-valley-rubin-excentric", name: "MEDI VALLEY Excentric Incanto, Rubin / Bulgaria", priceEur: 22, priceBgn: 43.03 },
          { id: "medi-valley-great-bulgaria", name: "MEDI VALLEY Great Bulgaria / Bulgaria", priceEur: 27, priceBgn: 52.8 },
        ],
      },
    ],
  },
  {
    id: "bezalkoholni",
    name: "Безалкохолни напитки",
    items: [
      { id: "mineralna-voda-500", name: "Минерална вода", portion: "500мл", priceEur: 1.5, priceBgn: 2.93 },
      { id: "mineralna-voda-1500", name: "Минерална вода", portion: "1.5л", priceEur: 3, priceBgn: 5.87 },
      { id: "kokakola-zero", name: "Кока-кола / зиро", portion: "330мл", priceEur: 2, priceBgn: 3.91 },
      { id: "fanta", name: "Фанта", portion: "330мл", priceEur: 2, priceBgn: 3.91 },
      { id: "domashna-limonada", name: "Домашна лимонада", portion: "350мл", priceEur: 3.5, priceBgn: 6.84 },
      { id: "ramune", name: "Рамуне", portion: "200мл", priceEur: 3, priceBgn: 5.87 },
      { id: "naturalen-sok", name: "Натурален сок", portion: "250мл", priceEur: 2, priceBgn: 3.91 },
    ],
  },
  {
    id: "organichni-chaiove",
    name: "Органични чайове",
    items: [
      { id: "bancha", name: "Банча", portion: "300мл", priceEur: 4, priceBgn: 7.82 },
      { id: "gyokuro-tokiva", name: "Гиокуро Токива", portion: "300мл", priceEur: 5, priceBgn: 9.78 },
      { id: "sladko-mate", name: "Сладко Мате", portion: "300мл", priceEur: 3, priceBgn: 5.87 },
      { id: "tea-forte-topal", name: "Tea Forté топъл", portion: "400мл", priceEur: 4.5, priceBgn: 8.8 },
      { id: "tea-forte-studen", name: "Tea Forté студен", portion: "800мл", priceEur: 6.5, priceBgn: 12.71 },
    ],
  },
  {
    id: "topli-napitki",
    name: "Топли напитки",
    items: [
      { id: "espreso", name: "Еспресо", portion: "30мл", priceEur: 2, priceBgn: 3.91 },
      { id: "kapuchino", name: "Капучино", portion: "140мл", priceEur: 3, priceBgn: 5.87 },
      { id: "late", name: "Лате", portion: "250мл", priceEur: 3, priceBgn: 5.87 },
      { id: "studeno-late", name: "Студено Лате", portion: "250мл", priceEur: 3, priceBgn: 5.87 },
      { id: "matcha-late", name: "Матча Лате", portion: "250мл", priceEur: 3.5, priceBgn: 6.84 },
      { id: "plodovo-matcha-late", name: "Плодово Матча Лате", portion: "350мл", priceEur: 4.5, priceBgn: 8.8 },
      { id: "goresht-shokolad", name: "Горещ шоколад", portion: "250мл", priceEur: 3.5, priceBgn: 6.84 },
    ],
  },
  {
    id: "bira",
    name: "Бира",
    items: [
      { id: "nalivna-bira-330", name: "Наливна Бира", portion: "330мл", priceEur: 3.5, priceBgn: 6.84 },
      { id: "nalivna-bira-500", name: "Наливна Бира", portion: "500мл", priceEur: 4.5, priceBgn: 8.8 },
      { id: "erdinger", name: "Ердингер", portion: "500мл", priceEur: 4.5, priceBgn: 8.8 },
      { id: "karlsberg-0", name: "Карлсберг 0%", portion: "330мл", priceEur: 3.5, priceBgn: 6.84 },
      { id: "karlsberg", name: "Карлсберг", portion: "330мл", priceEur: 3.5, priceBgn: 6.84 },
      { id: "budvayzer", name: "Будвайзер", portion: "330мл", priceEur: 3.5, priceBgn: 6.84 },
      { id: "grimbergen", name: "Гримберген", portion: "330мл", priceEur: 3.5, priceBgn: 6.84 },
      { id: "samarsbi", name: "Самърсби", portion: "330мл", priceEur: 3.5, priceBgn: 6.84 },
    ],
  },
  {
    id: "sake",
    name: "Саке",
    items: [
      { id: "choya", name: "Чоя", portion: "80мл", priceEur: 4.5, priceBgn: 8.8 },
      { id: "samurai", name: "Самурай", portion: "80мл", priceEur: 6, priceBgn: 11.73 },
      { id: "hanakizakura", name: "Ханакизакура", portion: "80мл", priceEur: 6.5, priceBgn: 12.71 },
      { id: "junmai-ginjo", name: "Жунмаи Гинджо", portion: "720мл", priceEur: 42, priceBgn: 82.14 },
      { id: "ichiban-shizuku", name: "Ичибан Шизуку", portion: "720мл", priceEur: 42, priceBgn: 82.14 },
      { id: "dai-ginjo-sakura", name: "Даи Гинджо Сакура", portion: "720мл", priceEur: 50, priceBgn: 97.78 },
      { id: "choya-umeshu", name: "Чоя Умешу Single Year", portion: "700мл", priceEur: 56, priceBgn: 109.53 },
    ],
  },
];
