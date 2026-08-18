"use client";

import { useState } from "react";
import type { Allergen, MenuItem } from "@/data/types";
import { allergenNames, formatPrice } from "@/lib/format";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import { BowlIcon, InfoIcon, LeafIcon } from "@/components/icons";

export function MenuItemCard({
  item,
  legend,
  fallbackImageUrl,
  fallbackImageAlt,
}: {
  item: MenuItem;
  legend: Allergen[];
  fallbackImageUrl?: string;
  fallbackImageAlt?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasDetails = Boolean(item.description || (item.allergens && item.allergens.length > 0));
  const names = allergenNames(item.allergens, legend);
  const imageUrl = item.imageUrl ?? fallbackImageUrl;
  const imageAlt = item.imageAlt ?? fallbackImageAlt ?? item.name;

  return (
    <article className="flex gap-4 rounded-2xl border border-line bg-white p-4">
      <PhotoPlaceholder
        className="h-20 w-20 shrink-0 rounded-xl"
        icon={<BowlIcon className="h-8 w-8" />}
        src={imageUrl}
        alt={imageAlt}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-1.5">
          <h3 className="font-display text-base leading-snug text-ink-900">{item.name}</h3>
          {item.vegetarian && (
            <LeafIcon className="mt-0.5 h-4 w-4 shrink-0 text-green-600" aria-label="Вегетарианско/веганско" />
          )}
        </div>
        <div className="mt-1.5 flex items-center justify-between gap-3">
          <span className="text-xs text-ink-500">{item.portion}</span>
          <div className="flex shrink-0 items-center gap-2">
            <span className="whitespace-nowrap text-sm font-semibold text-ink-900">
              {formatPrice(item.priceEur, item.priceBgn)}
            </span>
            {hasDetails && (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
                aria-label="Допълнителна информация"
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors ${
                  expanded ? "border-pink-500 bg-pink-50 text-pink-600" : "border-line text-ink-500 hover:border-pink-400 hover:text-pink-600"
                }`}
              >
                <InfoIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {expanded && hasDetails && (
          <div className="mt-3 space-y-2 border-t border-line pt-3 text-sm">
            {item.description && <p className="text-ink-700">{item.description}</p>}
            {names.length > 0 && (
              <p className="text-xs text-ink-500">
                <span className="font-medium text-ink-700">Алергени: </span>
                {names.join(", ")}
              </p>
            )}
          </div>
        )}

        {item.note && !expanded && <p className="mt-1 text-xs text-ink-500">{item.note}</p>}
      </div>
    </article>
  );
}
