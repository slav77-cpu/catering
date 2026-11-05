import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/Button";
import { SectionHeading } from "@/components/SectionHeading";
import { JsonLd } from "@/components/JsonLd";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import { SiteImage } from "@/components/SiteImage";
import { site } from "@/data/site";
import { pageMetadata, restaurantJsonLd } from "@/lib/seo";
import { stockImages } from "@/lib/stockImages";
import { BowlIcon, ClockIcon, MapPinIcon, PhoneIcon, SparkleIcon } from "@/components/icons";

export const metadata: Metadata = pageMetadata({
  description:
    "MAKA RAMEN — японска кухня в Пловдив: рамен, поке и суши ястия. MAKA CATERING — кетъринг за частни и фирмени събития.",
  path: "/",
});

export default function Home() {
  return (
    <>
      <JsonLd data={restaurantJsonLd()} />

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-ink-900 text-white" data-testid="hero">
        <SiteImage
          src={stockImages["hero-home"].url}
          alt={stockImages["hero-home"].alt}
          fill
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
          className="-z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-900/90 via-ink-900/65 to-ink-900/20" />
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-36 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pink-200">
            {site.city} · Японска кухня
          </p>
          <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
            {site.restaurantName}
            <span className="block text-pink-200">&amp; {site.cateringName}</span>
          </h1>
          <p className="mt-5 max-w-md text-white/90">
            Рамен, поке и суши ястия на място в {site.city} — и японски вдъхновен кетъринг за вашето следващо
            събитие.
          </p>
          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/90">
            <span className="inline-flex items-center gap-2">
              <ClockIcon className="h-4 w-4 text-pink-200" />
              {site.hours[0].time}
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPinIcon className="h-4 w-4 text-pink-200" />
              {site.addressText}
            </span>
          </div>
          <div className="mt-6">
            <a
              href={`tel:${site.phoneRestaurant.replace(/\s+/g, "")}`}
              className="inline-flex items-center gap-2 rounded-full bg-pink-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-pink-700"
            >
              <PhoneIcon className="h-4 w-4" />
              Обади се: {site.phoneRestaurant}
            </a>
          </div>
        </div>
      </section>

      {/* Two equal CTAs */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="Две услуги, един дух"
          title="С какво можем да помогнем?"
          align="center"
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <Link
            href="/restaurant"
            className="group overflow-hidden rounded-3xl border border-line bg-white transition-shadow hover:shadow-lg"
          >
            <PhotoPlaceholder
              className="aspect-[16/9] w-full"
              icon={<BowlIcon className="h-24 w-24" />}
              src={stockImages.ramen.url}
              alt={stockImages.ramen.alt}
              sizes="(max-width: 640px) 100vw, 50vw"
            />
            <div className="p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pink-600">Ресторант</p>
              <h3 className="mt-2 font-display text-2xl text-ink-900">Разгледай менюто</h3>
              <p className="mt-3 text-ink-700">
                Рамен, поке, корейско барбекю, вина и още — пълното меню на MAKA RAMEN.
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-pink-600 group-hover:text-pink-700">
                Виж менюто →
              </span>
            </div>
          </Link>

          <Link
            href="/catering"
            className="group relative overflow-hidden rounded-3xl border border-line bg-ink-900 text-white transition-shadow hover:shadow-lg"
          >
            <PhotoPlaceholder
              className="aspect-[16/9] w-full"
              icon={<SparkleIcon className="h-24 w-24" />}
              src={stockImages["hero-catering"].url}
              alt={stockImages["hero-catering"].alt}
              sizes="(max-width: 640px) 100vw, 50vw"
            />
            <SparkleIcon className="pointer-events-none absolute right-3 top-3 h-10 w-10 text-pink-200/80" />
            <div className="p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pink-300">Кетъринг</p>
              <h3 className="mt-2 font-display text-2xl">Кетъринг услуги</h3>
              <p className="mt-3 text-white/80">
                Japanese-inspired catering for your events — храна, сервиране и обслужване за вашето
                събитие.
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-pink-300 group-hover:text-pink-200">
                Разгледай MAKA CATERING →
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Quick info */}
      <section className="bg-pink-50/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 rounded-3xl bg-white p-8 shadow-sm sm:grid-cols-3 sm:p-10">
            <div className="flex items-start gap-3">
              <ClockIcon className="h-6 w-6 shrink-0 text-pink-500" />
              <div>
                <p className="text-sm font-semibold text-ink-900">Работно време</p>
                {site.hours.map((h) => (
                  <p key={h.day} className="text-sm text-ink-700">
                    {h.day}: {h.time}
                  </p>
                ))}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPinIcon className="h-6 w-6 shrink-0 text-pink-500" />
              <div>
                <p className="text-sm font-semibold text-ink-900">Адрес</p>
                <p className="text-sm text-ink-700">{site.addressText}</p>
                <Link href="/contacts" className="text-sm text-pink-600 hover:text-pink-700">
                  Виж на картата →
                </Link>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <PhoneIcon className="h-6 w-6 shrink-0 text-pink-500" />
              <div>
                <p className="text-sm font-semibold text-ink-900">Резервации</p>
                <p className="text-sm text-ink-700">По телефон</p>
                <Button
                  href={`tel:${site.phoneRestaurant.replace(/\s+/g, "")}`}
                  variant="ghost"
                  className="mt-1 !px-0 !py-0"
                >
                  {site.phoneRestaurant} →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
