"use client";

import { useMemo, useState } from "react";
import type { Allergen, MenuCategory, MenuItem } from "@/data/types";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { LeafIcon, SearchIcon } from "@/components/icons";

function matches(item: MenuItem, query: string): boolean {
  if (!query) return true;
  const haystack = `${item.name} ${item.description ?? ""}`.toLowerCase();
  return haystack.includes(query.toLowerCase());
}

export function MenuBrowser({ menu, legend }: { menu: MenuCategory[]; legend: Allergen[] }) {
  const [query, setQuery] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [activeIds, setActiveIds] = useState<Set<string>>(() => new Set(menu.map((c) => c.id)));

  const allActive = activeIds.size === menu.length;

  function toggleCategory(id: string) {
    setActiveIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function resetCategories() {
    setActiveIds(new Set(menu.map((c) => c.id)));
  }

  const filteredMenu = useMemo(() => {
    return menu
      .filter((cat) => activeIds.has(cat.id))
      .map((cat) => {
        const filterItems = (items: MenuItem[]) =>
          items.filter((item) => matches(item, query) && (!vegOnly || item.vegetarian));

        if (cat.subgroups) {
          const subgroups = cat.subgroups
            .map((sg) => ({ ...sg, items: filterItems(sg.items) }))
            .filter((sg) => sg.items.length > 0);
          return { ...cat, subgroups, items: undefined };
        }

        return { ...cat, items: filterItems(cat.items ?? []) };
      })
      .filter((cat) => (cat.subgroups ? cat.subgroups.length > 0 : (cat.items?.length ?? 0) > 0));
  }, [menu, activeIds, query, vegOnly]);

  return (
    <div>
      {/* Search + veg toggle */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Търси по име или съставка…"
            className="w-full rounded-full border border-line bg-white py-3 pl-11 pr-4 text-sm text-ink-900 placeholder:text-ink-500 focus:border-pink-400 focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={() => setVegOnly((v) => !v)}
          aria-pressed={vegOnly}
          className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-full border px-4 py-3 text-sm font-medium transition-colors ${
            vegOnly ? "border-green-600 bg-green-50 text-green-700" : "border-line text-ink-700 hover:border-pink-400"
          }`}
        >
          <LeafIcon className="h-4 w-4" />
          Само вегетариански/вегански
        </button>
      </div>

      <div className="mt-4 grid gap-6 md:grid-cols-[220px_1fr] md:items-start md:gap-10">
        {/* Desktop sidebar */}
        <aside className="hidden md:sticky md:top-24 md:block">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-ink-500">Категории</p>
          <div className="flex flex-col gap-1">
            <CategoryToggle label="Всички" active={allActive} onClick={resetCategories} />
            {menu.map((cat) => (
              <CategoryToggle
                key={cat.id}
                label={cat.name}
                active={activeIds.has(cat.id)}
                onClick={() => toggleCategory(cat.id)}
              />
            ))}
          </div>
        </aside>

        {/* Mobile sticky chip row */}
        <div className="sticky top-16 z-30 -mx-4 flex gap-2 overflow-x-auto border-b border-line bg-cream/95 px-4 py-3 backdrop-blur md:hidden">
          <CategoryChip label="Всички" active={allActive} onClick={resetCategories} />
          {menu.map((cat) => (
            <CategoryChip
              key={cat.id}
              label={cat.name}
              active={activeIds.has(cat.id)}
              onClick={() => toggleCategory(cat.id)}
            />
          ))}
        </div>

        {/* Results */}
        <div className="space-y-12">
          {filteredMenu.length === 0 && (
            <p className="rounded-2xl border border-dashed border-line p-8 text-center text-sm text-ink-500">
              Няма ястия, отговарящи на търсенето. Опитайте друга категория или дума.
            </p>
          )}

          {filteredMenu.map((cat) => (
            <section key={cat.id} id={cat.id} className="scroll-mt-32">
              <h2 className="font-display text-2xl text-ink-900">{cat.name}</h2>
              {cat.note && <p className="mt-1 text-sm text-pink-600">{cat.note}</p>}

              {cat.items && (
                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {cat.items.map((item) => (
                    <MenuItemCard key={item.id} item={item} legend={legend} />
                  ))}
                </div>
              )}

              {cat.subgroups && (
                <div className="mt-5 space-y-8">
                  {cat.subgroups.map((sg) => (
                    <div key={sg.id}>
                      <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-ink-500">
                        {sg.name}
                      </h3>
                      <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {sg.items.map((item) => (
                          <MenuItemCard key={item.id} item={item} legend={legend} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

function CategoryChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
        active ? "border-pink-500 bg-pink-500 text-white" : "border-line bg-white text-ink-700"
      }`}
    >
      {label}
    </button>
  );
}

function CategoryToggle({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
        active ? "bg-pink-50 text-pink-700" : "text-ink-700 hover:bg-pink-50/60"
      }`}
    >
      {label}
    </button>
  );
}
