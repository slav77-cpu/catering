import type { Metadata } from "next";
import Link from "next/link";
import { MenuBrowser } from "@/components/menu/MenuBrowser";
import { allergenLegend, restaurantMenu } from "@/data/restaurantMenu";
import { site } from "@/data/site";
import { PhoneIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Меню",
  description: `Пълното меню на ${site.restaurantName} — рамен, поке, предястия, корейско барбекю, вина и напитки.`,
};

export default function RestaurantPage() {
  return (
    <div className="pb-24 md:pb-16">
      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
        <Link href="/" className="text-sm text-ink-500 hover:text-pink-600">
          ← Начало
        </Link>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pink-500">Ресторант</p>
            <h1 className="mt-1 font-display text-3xl text-ink-900 sm:text-4xl">Меню</h1>
            <p className="mt-2 max-w-xl text-sm text-ink-700">
              Менюто е само за разглеждане — поръчки и резервации се правят по телефон.
            </p>
          </div>
          <a
            href={`tel:${site.phoneRestaurant.replace(/\s+/g, "")}`}
            className="hidden items-center gap-2 rounded-full bg-pink-500 px-5 py-3 text-sm font-medium text-white hover:bg-pink-600 sm:inline-flex"
          >
            <PhoneIcon className="h-4 w-4" />
            Обади се за поръчка
          </a>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-6xl px-4 sm:px-6 lg:px-8">
        <MenuBrowser menu={restaurantMenu} legend={allergenLegend} />
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
          className="flex w-full items-center justify-center gap-2 rounded-full bg-pink-500 py-3 text-sm font-medium text-white"
        >
          <PhoneIcon className="h-4 w-4" />
          Обади се за поръчка · {site.phoneRestaurant}
        </a>
      </div>
    </div>
  );
}
