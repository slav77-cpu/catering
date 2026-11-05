import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/Button";
import { SectionHeading } from "@/components/SectionHeading";
import { SiteImage } from "@/components/SiteImage";
import { CateringMenu } from "@/components/catering/CateringMenu";
import { EventGallery } from "@/components/catering/EventGallery";
import { InquiryForm } from "@/components/catering/InquiryForm";
import { site } from "@/data/site";
import { getPublicGallery, getPublicMenu } from "@/lib/menu";
import { pageMetadata } from "@/lib/seo";
import { stockImages } from "@/lib/stockImages";
import { cateringHero, cateringHighlights, eventTypes, packageTiers, cateringFaq } from "@/data/cateringPage";
import {
  BowlIcon,
  UsersIcon,
  LeafIcon,
  SparkleIcon,
  PhoneIcon,
  InstagramIcon,
  ClockIcon,
} from "@/components/icons";

export const metadata: Metadata = pageMetadata({
  title: "Кетъринг",
  description: `${site.cateringName} — японски вдъхновен кетъринг за частни и фирмени събития в ${site.city}. Изпратете запитване за оферта, съобразена с вашето събитие.`,
  path: "/catering",
});

// Rendered per request so uploaded photos and changed prices show up immediately.
export const dynamic = "force-dynamic";

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

const telHref = `tel:${site.phoneCatering.replace(/\s+/g, "")}`;

export default async function CateringPage() {
  const [menu, gallery] = await Promise.all([getPublicMenu("CATERING"), getPublicGallery()]);

  return (
    <div className="pb-16">
      {/* 1. Представяне на услугата */}
      <section className="relative isolate overflow-hidden bg-ink-900 text-white">
        <SiteImage
          src={stockImages["hero-catering"].url}
          alt={stockImages["hero-catering"].alt}
          fill
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
          className="-z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-900/90 via-ink-900/70 to-ink-900/30" />
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-32 lg:px-8">
          <Link href="/" className="text-sm text-white/85 hover:text-white">
            ← Начало
          </Link>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.25em] text-pink-200">{site.cateringName}</p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl leading-tight sm:text-5xl">{cateringHero.slogans[0]}</h1>
          <p className="mt-3 font-display text-xl text-pink-200">{cateringHero.slogans[1]}</p>
          <p className="mt-5 max-w-md text-white/90">{cateringHero.description}</p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={telHref}
              className="inline-flex items-center gap-2 rounded-full bg-pink-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-pink-700"
            >
              <PhoneIcon className="h-4 w-4" />
              {site.phoneCatering}
            </a>
            <a
              href={site.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-pink-200"
            >
              <InstagramIcon className="h-4 w-4" />
              {site.instagramHandle}
            </a>
          </div>
        </div>
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
            onDark
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

        <CateringMenu menu={menu} />

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

      <EventGallery photos={gallery} />

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
              className="inline-flex items-center justify-center gap-2 rounded-full bg-pink-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-pink-700"
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
