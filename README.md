# MAKA RAMEN & MAKA CATERING — уебсайт

Сайт за ресторант **MAKA RAMEN** и **MAKA CATERING** в гр. Пловдив: меню, кетъринг,
контакти и запитвания през форма, плюс админски панел, от който клиентът сам качва
снимки и сменя артикули и цени.

**Важно:** сайтът **няма количка, поръчки, разплащания, резервации, регистрация на
потребители и многоезичност** — това е изрично решение на клиента. Ако някой реши да
добавя такава функционалност, това минава през ново обсъждане, а не се приема за
пропуск, който „трябва да се поправи“.

## Технологии

- [Next.js 16](https://nextjs.org) (App Router), React 19, TypeScript, Tailwind CSS v4
- PostgreSQL и [Prisma](https://www.prisma.io) — меню и галерия
- [NextAuth](https://next-auth.js.org) с credentials provider — вход за администратор
- [Cloudinary](https://cloudinary.com) — снимки (качване директно от браузъра, доставка през CDN)
- [nodemailer](https://nodemailer.com) — имейли от формите
- [Playwright](https://playwright.dev) — браузърни тестове

## Стартиране локално

Нужни са Node 22 и PostgreSQL.

```bash
npm install
cp .env.example .env.local     # попълнете стойностите
npx prisma migrate deploy      # създава таблиците
npm run db:seed                # прехвърля менюто от src/data в базата
npm run admin:create -- вие@example.com
npm run dev
```

Сайтът е на [http://localhost:3000](http://localhost:3000), панелът на `/admin`.

Без SMTP променливи формите работят, но запитванията само се логват в конзолата.

| Команда | Какво прави |
|---|---|
| `npm run db:migrate` | Нова миграция след промяна на `prisma/schema.prisma` |
| `npm run db:seed` | Зарежда началното меню. Не прави нищо, ако в базата вече има категории |
| `npm run admin:create -- имейл` | Нов администратор (пита за парола, поне 12 знака) |
| `npm run admin:create -- имейл --reset` | Смяна на парола |
| `npm run test:e2e` | Браузърните тестове (нужна е направена `npm run build`, база с seed и админ; `E2E_ADMIN_EMAIL` и `E2E_ADMIN_PASSWORD` задават акаунта) |

## Къде живее съдържанието

- **В базата** (клиентът го променя от `/admin`): артикули и цени, категории, снимки на
  артикули, галерията от събития.
- **В кода** (промяна през разработчик): текстове на страници, дизайн и структура —
  `src/data/site.ts` (контакти, работно време) и `src/data/cateringPage.ts` (текстове и
  пакети за кетъринг).
- **Само за seed:** `src/data/restaurantMenu.ts` и `src/data/cateringContent.ts`. Сайтът не
  ги чете и ESLint забранява да се импортират от него — промяна в тях не променя сайта.
- `src/lib/stockImages.ts` — стокови снимки от Unsplash за героите и за артикули без своя снимка.

## Пускане в производство

Стъпките в Render и Cloudinary се правят ръчно, еднократно и **в този ред**. Докато не са
зададени всички променливи от `.env.example`, `next build` спира с грешка, а Render
продължава да сервира последната успешна версия.

### 1. Cloudinary

1. Създайте акаунт. От Dashboard вземете `Cloud name`, `API Key`, `API Secret`.
2. Settings → Upload → Upload presets → **Add upload preset**:
   Signing mode **Signed**. Името му е `CLOUDINARY_UPLOAD_PRESET`.

Безплатният план приема до **10 MB на снимка**. Панелът приема до 20 MB според заданието, но
файлове между 10 и 20 MB ще бъдат отказани от Cloudinary с ясно съобщение, докато планът не се
надгради. Проверете лимитите на акаунта в Settings → Usage limits.

### 2. Render

1. Създайте **PostgreSQL** на платен план (безплатният изтича след 30 дни) и включете
   архивирането. Копирайте **Internal** и **External Database URL**.
2. Web Service → Environment: задайте всички променливи от `.env.example`, като
   `DATABASE_URL` е **Internal** адресът, а `NEXTAUTH_URL` е публичният адрес на сайта.
   `NEXTAUTH_SECRET` се генерира с `openssl rand -base64 32`.
3. Web Service → Settings:
   - **Auto-Deploy: No** — деплоят минава само през конвейера;
   - Build Command: `npm ci --include=dev && npm run build` (`--include=dev`, защото при `NODE_ENV=production` npm пропуска TypeScript и Tailwind, а те трябват за build-а);
   - Start Command: `npm start` (прилага чакащите миграции и стартира сайта; ако миграцията
     се провали, старата версия остава активна);
   - план без заспиване; собствен домейн с HTTPS.
4. Settings → **Deploy Hook**: копирайте адреса.

### 3. GitHub

Settings → Secrets and variables → Actions → **New repository secret**:
`RENDER_DEPLOY_HOOK_URL` със стойност адреса от предната стъпка.

### 4. Първоначални данни

Еднократно, от локална машина, с **External** адреса на базата (стойността не се записва никъде):

```bash
export DATABASE_URL='<External Database URL>'
npx prisma migrate deploy
npm run db:seed
npm run admin:create -- имейл-на-клиента
unset DATABASE_URL
```

Направете го **преди** първия деплой, иначе менюто ще е празно, докато не го направите.

### 5. Деплой

Всеки push в `main` минава през `.github/workflows/ci.yml`: lint, типове, build, браузърни
тестове и чак тогава deploy hook. При червен конвейер деплой няма.

### 6. След първия деплой

- Качете снимка от телефон в `/admin/gallery` и проверете, че се вижда в `/catering`.
- Пуснете [PageSpeed Insights](https://pagespeed.web.dev/) за началната страница и менюто.
- Проверете структурираните данни с [Rich Results Test](https://search.google.com/test/rich-results)
  и споделянето с [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/).

## Изисквания към снимките

Какво да достави клиентът или фотографът:

| | |
|---|---|
| Формат | JPEG, максимално качество (или HEIC от телефон) |
| Размер | ≥ 2400 px по дългата страна за героите, ≥ 1600 px за менюто |
| Цветови профил | **sRGB** (не Adobe RGB) |
| Без | водни знаци, заточване за уеб, предварително смаляване |
| Кадриране | част от снимките с празно място за текст върху тях |

Не се иска WebP/AVIF — Cloudinary избира формат и качество според устройството (`f_auto,q_auto`).

## Все още се чака от клиента

1. Реални снимки на храна, интериор и събития. Дотогава артикулите показват стокова снимка
   на категорията си, затова в една категория снимките се повтарят.
2. Потвърждение кои езици трябва да поддържа сайтът — в момента е само на български.
3. Потвърждение къде да пристигат запитванията — в момента само по имейл.
4. Пълен списък с кетъринг ястия и цени. Сегашните са цените на ресторанта с надценка (`src/lib/cateringPricing.ts`).
5. Точен адрес за Google Maps, работно време, бизнес имейл и домейн — в `src/data/site.ts` има `TODO`.
