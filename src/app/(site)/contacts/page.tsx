import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/contacts/ContactForm";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";
import { ClockIcon, FacebookIcon, InstagramIcon, MapPinIcon, PhoneIcon } from "@/components/icons";

export const metadata: Metadata = pageMetadata({
  title: "Контакти",
  description: `Свържете се с ${site.restaurantName} — адрес, телефон, работно време и карта на локацията в ${site.city}.`,
  path: "/contacts",
});

export default function ContactsPage() {
  const phones =
    site.phoneCatering !== site.phoneRestaurant
      ? [
          { label: "Ресторант", value: site.phoneRestaurant },
          { label: "Кетъринг", value: site.phoneCatering },
        ]
      : [{ label: "Телефон", value: site.phoneRestaurant }];

  return (
    <div className="pb-16">
      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
        <Link href="/" className="text-sm text-ink-500 hover:text-pink-600">
          ← Начало
        </Link>

        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pink-600">Контакти</p>
          <h1 className="mt-1 font-display text-3xl text-ink-900 sm:text-4xl">Контакти</h1>
          <p className="mt-2 max-w-xl text-sm text-ink-700">
            Ще се радваме да чуем от вас — по телефон, имейл или с кратко съобщение по-долу.
          </p>
        </div>
      </div>

      <div className="mx-auto mt-8 grid max-w-6xl gap-8 px-4 sm:px-6 lg:mt-10 lg:grid-cols-2 lg:gap-10 lg:px-8">
        {/* Map + info */}
        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl border border-line sm:rounded-3xl">
            {/*
              Text-search embed — no API key required. Swap for an exact
              address or "place_id:<id>" embed once the client confirms the
              precise location (see the TODO on site.mapsQuery in src/data/site.ts).
            */}
            <iframe
              src={`https://www.google.com/maps?q=${encodeURIComponent(site.mapsQuery)}&output=embed`}
              width="100%"
              height="320"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block h-[320px] w-full border-0 sm:h-[420px]"
              title="Локация на картата"
            />
          </div>

          <div className="rounded-2xl border border-line bg-white p-6 sm:rounded-3xl sm:p-8">
            <div className="flex items-start gap-3">
              <MapPinIcon className="h-5 w-5 shrink-0 text-pink-500" />
              <div>
                <p className="text-sm font-semibold text-ink-900">Адрес</p>
                <p className="text-sm text-ink-700">{site.addressText}</p>
                <a
                  href={site.mapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-2 rounded-full bg-pink-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-pink-700"
                >
                  Навигирай
                </a>
              </div>
            </div>

            <div className="mt-6 flex items-start gap-3">
              <PhoneIcon className="h-5 w-5 shrink-0 text-pink-500" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-ink-900">Телефон</p>
                {phones.map((p) => (
                  <p key={p.label} className="text-sm text-ink-700">
                    {p.label !== "Телефон" && <span className="text-ink-500">{p.label}: </span>}
                    <a href={`tel:${p.value.replace(/\s+/g, "")}`} className="text-pink-600 hover:text-pink-700">
                      {p.value}
                    </a>
                  </p>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-start gap-3">
              <ClockIcon className="h-5 w-5 shrink-0 text-pink-500" />
              <div>
                <p className="text-sm font-semibold text-ink-900">Работно време</p>
                {site.hours.map((h) => (
                  <p key={h.day} className="text-sm text-ink-700">
                    {h.day}: {h.time}
                  </p>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4 border-t border-line pt-6">
              <a
                href={site.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-700 transition-colors hover:border-pink-400 hover:text-pink-600"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
              {site.facebookUrl && (
                <a
                  href={site.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-700 transition-colors hover:border-pink-400 hover:text-pink-600"
                >
                  <FacebookIcon className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Contact form */}
        <div>
          <div className="rounded-2xl border border-line bg-white p-6 sm:rounded-3xl sm:p-8">
            <h2 className="font-display text-2xl text-ink-900">Изпратете ни съобщение</h2>
            <p className="mt-2 text-sm text-ink-700">
              Попълнете формата и ще се свържем с вас възможно най-скоро.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
