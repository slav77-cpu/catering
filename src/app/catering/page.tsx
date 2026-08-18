import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/Button";
import { SectionHeading } from "@/components/SectionHeading";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import { WaveDivider, EnsoCircle } from "@/components/decor";
import { InquiryForm } from "@/components/catering/InquiryForm";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { site } from "@/data/site";
import { allergenLegend } from "@/data/restaurantMenu";
import { stockImages } from "@/lib/stockImages";
import {
  cateringHero,
  cateringHighlights,
  eventTypes,
  packageTiers,
  cateringMenuCategories,
  cateringFaq,
} from "@/data/cateringContent";
import {
  BowlIcon,
  UsersIcon,
  LeafIcon,
  SparkleIcon,
  PhoneIcon,
  InstagramIcon,
  ClockIcon,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Кетъринг",
  description: `${site.cateringName} — японски вдъхновен кетъринг за частни и фирмени събития в ${site.city}. Изпратете запитване за оферта, съобразена с вашето събитие.`,
};

const highlightIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "japanese-cuisine": BowlIcon,
  "professional-staff": UsersIcon,
  "fresh-quality": LeafIcon,
  "full-service": SparkleIcon,
};

const eventTypeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  private: UsersIcon,
  corporate: BowlIcon,
  birthdays: SparkleIcon,
  openings: ClockIcon,
};

const menuCategoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "topli-predyastiya": BowlIcon,
  "studeni-predyastiya": LeafIcon,
  "tabli-bufeti": UsersIcon,
  deserti: SparkleIcon,
  napitki: BowlIcon,
  "firmeni-partita": UsersIcon,
};

const telHref = `tel:${site.phoneCatering.replace(/\s+/g, "")}`;

export default function CateringPage() {
  return (
    <div className="pb-16">
      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
        <Link href="/" className="text-sm text-ink-500 hover:text-pink-600">
          ← Начало
        </Link>
      </div>

      {/* 1. Представяне на услугата */}
      <section className="relative overflow-hidden">
        <EnsoCircle className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 text-pink-200/50" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-2 md:items-center md:py-16 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pink-500">
              {site.cateringName}
            </p>
            <h1 className="mt-3 font-display text-4xl leading-tight text-ink-900 sm:text-5xl">
              {cateringHero.slogans[0]}
            </h1>
            <p className="mt-3 font-display text-xl text-pink-500">{cateringHero.slogans[1]}</p>
            <p className="mt-5 max-w-md text-ink-700">{cateringHero.description}</p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={telHref}
                className="inline-flex items-center gap-2 rounded-full bg-pink-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-pink-600"
              >
                <PhoneIcon className="h-4 w-4" />
                {site.phoneCatering}
              </a>
              <a
                href={site.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-pink-600 hover:text-pink-700"
              >
                <InstagramIcon className="h-4 w-4" />
                {site.instagramHandle}
              </a>
            </div>
          </div>
          <PhotoPlaceholder
            className="aspect-[4/3] w-full rounded-3xl"
            icon={<SparkleIcon className="h-20 w-20" />}
            src={stockImages["hero-catering"].url}
            alt={stockImages["hero-catering"].alt}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <WaveDivider className="h-8 w-full text-pink-50/60" />
      </section>

      {/* Highlights */}
      <section className="bg-pink-50/60">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cateringHighlights.map((h) => {
              const Icon = highlightIcons[h.id] ?? SparkleIcon;
              return (
                <div
                  key={h.id}
                  className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-white p-6 text-center"
                >
                  <Icon className="h-8 w-8 text-pink-500" />
                  <p className="text-sm font-medium text-ink-900">{h.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Event types */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="За всеки повод"
          title="Видове събития"
          subtitle="Организираме кетъринг за широк кръг поводи — от интимни събирания до големи фирмени партита."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {eventTypes.map((e) => {
            const Icon = eventTypeIcons[e.id] ?? SparkleIcon;
            return (
              <div
                key={e.id}
                className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-white p-6 text-center transition-shadow hover:shadow-sm"
              >
                <Icon className="h-7 w-7 text-pink-500" />
                <p className="font-display text-lg text-ink-900">{e.label}</p>
                <p className="text-sm text-ink-500">{e.labelBg}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Пакети/оферти */}
      <section className="bg-ink-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            kicker="Пакети"
            title="Изберете база за вашата оферта"
            subtitle="Всяка оферта се изготвя индивидуално според броя гости, мястото и повода — пакетите по-долу са отправна точка за разговор, не фиксирани цени."
          />
          <div className="mt-3 text-sm text-white/70">
            Точната цена и минимален брой гости се уточняват по запитване, съобразени изцяло с вашето
            събитие.
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {packageTiers.map((tier) => (
              <div
                key={tier.id}
                className="flex flex-col rounded-3xl border border-white/15 bg-white/5 p-7 backdrop-blur"
              >
                <h3 className="font-display text-2xl">{tier.name}</h3>
                <p className="mt-2 text-sm text-white/75">{tier.description}</p>
                <ul className="mt-5 flex-1 space-y-2 text-sm text-white/85">
                  {tier.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-pink-400" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 space-y-1 border-t border-white/15 pt-4 text-sm text-white/70">
                  <p>Цена: {tier.priceNote}</p>
                  <p>Минимален брой гости: {tier.minGuestsNote}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Button href="#zapitvane" variant="primary">
              Изпрати запитване
            </Button>
          </div>
        </div>
      </section>

      {/* 3. Кетъринг меню */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="Меню"
          title="Кетъринг меню"
          subtitle="Категориите по-долу са организирани по логика на събитие и начин на поднасяне — различно от менюто в ресторанта."
        />
        <p className="mt-3 max-w-2xl text-sm text-pink-600">
          Цените по-долу са ориентировъчни — изчислени от менюто на ресторанта с надценка за кетъринг,
          докато получим официален ценоразпис за кетъринг от собственика. Финалната оферта винаги се
          потвърждава по телефона.
        </p>

        <div className="mt-8 space-y-10">
          {cateringMenuCategories.map((cat) => {
            const Icon = menuCategoryIcons[cat.id] ?? BowlIcon;
            return (
              <div key={cat.id}>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-pink-50">
                    <Icon className="h-5 w-5 text-pink-500" />
                  </div>
                  <h3 className="font-display text-xl text-ink-900">{cat.name}</h3>
                </div>
                {cat.note && <p className="mt-2 text-sm text-ink-500">{cat.note}</p>}

                {cat.items.length > 0 ? (
                  <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {cat.items.map((item) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        legend={allergenLegend}
                        fallbackImageUrl={cat.imageUrl}
                        fallbackImageAlt={cat.imageAlt}
                      />
                    ))}
                  </div>
                ) : (
                  !cat.note && (
                    <p className="mt-3 text-sm text-ink-500">Предстои — очаквайте скоро.</p>
                  )
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col items-start gap-4 rounded-2xl border border-line bg-pink-50/60 p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-700">
            Не откривате точно това, което търсите? Кажете ни за вашето събитие и ще предложим ястия,
            съобразени с повода.
          </p>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Button href="#zapitvane" variant="primary">
              Към формата
            </Button>
            <Button href={telHref} variant="secondary">
              Обади се
            </Button>
          </div>
        </div>
      </section>

      {/* 4. FAQ */}
      <section className="bg-pink-50/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading kicker="Въпроси" title="Често задавани въпроси" />
          <div className="mt-8 space-y-3">
            {cateringFaq.map((faq) => (
              <details
                key={faq.question}
                className="rounded-2xl border border-line bg-white p-5 text-sm text-ink-700"
              >
                <summary className="cursor-pointer font-medium text-ink-900">{faq.question}</summary>
                <p className="mt-3">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Форма за запитване/оферта */}
      <section id="zapitvane" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="Запитване"
          title="Заявете оферта за вашето събитие"
          subtitle="Попълнете формата с детайли за събитието и ще се свържем с вас, за да изготвим индивидуална оферта."
        />
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <InquiryForm />
          </div>
          <aside className="flex flex-col justify-between gap-4 rounded-3xl border border-line bg-white p-7">
            <div>
              <p className="font-display text-xl text-ink-900">Предпочитате директно обаждане?</p>
              <p className="mt-2 text-sm text-ink-700">
                Обадете ни се директно — с удоволствие ще обсъдим детайлите на вашето събитие по телефона.
              </p>
            </div>
            <a
              href={telHref}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-pink-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-pink-600"
            >
              <PhoneIcon className="h-4 w-4" />
              {site.phoneCatering}
            </a>
            <a
              href={site.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 text-sm font-medium text-pink-600 hover:text-pink-700"
            >
              <InstagramIcon className="h-4 w-4" />
              {site.instagramHandle}
            </a>
          </aside>
        </div>
      </section>
    </div>
  );
}
