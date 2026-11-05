"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { MenuCategory, MenuItem } from "@/data/types";
import { MenuItemGrid } from "@/components/menu/MenuItemCard";
import { MenuDetailsPanel } from "@/components/menu/MenuDetailsPanel";
import { LeafIcon, SearchIcon } from "@/components/icons";

function matches(item: MenuItem, query: string): boolean {
  if (!query) return true;
  const haystack = `${item.name} ${item.description ?? ""}`.toLowerCase();
  return haystack.includes(query.toLowerCase());
}

function hasItems(category: MenuCategory): boolean {
  return (category.items?.length ?? 0) > 0 || (category.subgroups?.length ?? 0) > 0;
}

/** Highlights whichever section sits just under the sticky header and category bar. */
function useVisibleSection(sectionIds: string[]): string | undefined {
  const [visibleId, setVisibleId] = useState<string>();
  const key = sectionIds.join("|");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entering = entries.find((entry) => entry.isIntersecting);
        if (entering) setVisibleId(entering.target.id);
      },
      { rootMargin: "-160px 0px -65% 0px" },
    );
    for (const id of key.split("|")) {
      const section = id && document.getElementById(id);
      if (section) observer.observe(section);
    }
    return () => observer.disconnect();
  }, [key]);

  return visibleId && sectionIds.includes(visibleId) ? visibleId : sectionIds[0];
}

export function MenuBrowser({ menu }: { menu: MenuCategory[] }) {
  const [query, setQuery] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [selected, setSelected] = useState<MenuItem | null>(null);
  const categoryBar = useRef<HTMLElement>(null);

  const filteredMenu = useMemo(() => {
    const filterItems = (items: MenuItem[]) =>
      items.filter((item) => matches(item, query) && (!vegOnly || item.vegetarian));

    return menu
      .map((category) => ({
        ...category,
        items: filterItems(category.items ?? []),
        subgroups: (category.subgroups ?? [])
          .map((subgroup) => ({ ...subgroup, items: filterItems(subgroup.items) }))
          .filter((subgroup) => subgroup.items.length > 0),
      }))
      .filter(hasItems);
  }, [menu, query, vegOnly]);

  const activeId = useVisibleSection(filteredMenu.map((category) => category.id));

  // Keep the highlighted category in view inside the horizontally scrolling bar.
  useEffect(() => {
    const bar = categoryBar.current;
    const link = bar?.querySelector<HTMLElement>('[aria-current="true"]');
    if (bar && link) {
      bar.scrollTo({ left: link.offsetLeft - (bar.clientWidth - link.offsetWidth) / 2, behavior: "smooth" });
    }
  }, [activeId]);

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
            aria-label="Търси в менюто"
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

      {/* Category jump bar */}
      <nav
        ref={categoryBar}
        aria-label="Категории"
        className="sticky top-16 z-30 -mx-4 mt-4 flex gap-2 overflow-x-auto border-b border-line bg-cream/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
      >
        {filteredMenu.map((category) => {
          const active = category.id === activeId;
          return (
            <a
              key={category.id}
              href={`#${category.id}`}
              aria-current={active ? "true" : undefined}
              className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                active ? "border-pink-600 bg-pink-600 text-white" : "border-line bg-white text-ink-700 hover:border-pink-400"
              }`}
            >
              {category.name}
            </a>
          );
        })}
      </nav>

      <div className="mt-6 space-y-12">
        {filteredMenu.length === 0 && (
          <p className="rounded-2xl border border-dashed border-line p-8 text-center text-sm text-ink-700">
            Няма ястия, отговарящи на търсенето. Опитайте друга дума.
          </p>
        )}

        {filteredMenu.map((category, categoryIndex) => (
          <section key={category.id} id={category.id} className="scroll-mt-36">
            <h2 className="font-display text-2xl text-ink-900">{category.name}</h2>
            {category.note && <p className="mt-1 text-sm text-pink-700">{category.note}</p>}

            {category.items.length > 0 && (
              <div className="mt-5">
                <MenuItemGrid items={category.items} onOpen={setSelected} isFirstOnPage={categoryIndex === 0} />
              </div>
            )}

            {category.subgroups.map((subgroup) => (
              <div key={subgroup.id} className="mt-8">
                <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-ink-700">{subgroup.name}</h3>
                <div className="mt-3">
                  <MenuItemGrid items={subgroup.items} onOpen={setSelected} />
                </div>
              </div>
            ))}
          </section>
        ))}
      </div>

      {selected && <MenuDetailsPanel key={selected.id} item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
