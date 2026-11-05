import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { MenuBrowser } from "@/components/menu/MenuBrowser";
import { allergenLegend } from "@/data/allergens";
import { site } from "@/data/site";
import { PhoneIcon } from "@/components/icons";
import { getPublicMenu } from "@/lib/menu";
import { menuJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Меню",
  description: `Пълното меню на ${site.restaurantName} — рамен, поке, предястия, корейско барбекю, вина и напитки.`,
  path: "/restaurant",
});

// Rendered per request so a price the client changes shows up immediately.
export const dynamic = "force-dynamic";

export default async function RestaurantPage() {
  const menu = await getPublicMenu("RESTAURANT");

  return (
    <div className="pb-24 md:pb-16">
      <JsonLd data={menuJsonLd(menu)} />
      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
        <Link href="/" className="text-sm text-ink-700 hover:text-pink-700">
          ← Начало
        </Link>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pink-700">Ресторант</p>
            <h1 className="mt-1 font-display text-3xl text-ink-900 sm:text-4xl">Меню</h1>
            <p className="mt-2 max-w-xl text-sm text-ink-700">
              Менюто е само за разглеждане — поръчки и резервации се правят по телефон.
            </p>
          </div>
          <a
            href={`tel:${site.phoneRestaurant.replace(/\s+/g, "")}`}
            className="hidden items-center gap-2 rounded-full bg-pink-600 px-5 py-3 text-sm font-medium text-white hover:bg-pink-700 sm:inline-flex"
          >
            <PhoneIcon className="h-4 w-4" />
            Обади се за поръчка
          </a>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-6xl px-4 sm:px-6 lg:px-8">
        <MenuBrowser menu={menu} />
      </div>

      <div className="mx-auto mt-12 max-w-6xl px-4 sm:px-6 lg:px-8">
        <details className="rounded-2xl border border-line bg-white p-5 text-sm text-ink-700">
          <summary className="cursor-pointer font-medium text-ink-900">Легенда на алергените</summary>
          <ul className="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
            {allergenLegend.map((a) => (
              <li key={a.code}>
                {a.code} — {a.name}
              </li>
            ))}
          </ul>
        </details>
      </div>

      {/* Sticky call bar, mobile only */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-cream/95 p-3 backdrop-blur md:hidden">
        <a
          href={`tel:${site.phoneRestaurant.replace(/\s+/g, "")}`}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-pink-600 py-3 text-sm font-medium text-white"
        >
          <PhoneIcon className="h-4 w-4" />
          Обади се за поръчка · {site.phoneRestaurant}
        </a>
      </div>
    </div>
  );
}
