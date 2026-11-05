"use client";

import { useState, type ComponentType } from "react";
import type { MenuCategory, MenuItem } from "@/data/types";
import { MenuItemGrid } from "@/components/menu/MenuItemCard";
import { MenuDetailsPanel } from "@/components/menu/MenuDetailsPanel";
import { BowlIcon, LeafIcon, SparkleIcon, UsersIcon } from "@/components/icons";

const categoryIcons: Record<string, ComponentType<{ className?: string }>> = {
  "topli-predyastiya": BowlIcon,
  "studeni-predyastiya": LeafIcon,
  "tabli-bufeti": UsersIcon,
  deserti: SparkleIcon,
  napitki: BowlIcon,
  "firmeni-partita": UsersIcon,
};

export function CateringMenu({ menu }: { menu: MenuCategory[] }) {
  const [selected, setSelected] = useState<MenuItem | null>(null);

  return (
    <div className="mt-8 space-y-10">
      {menu.map((category) => {
        const Icon = categoryIcons[category.id] ?? BowlIcon;
        const items = category.items ?? [];
        const subgroups = category.subgroups ?? [];
        const isEmpty = items.length === 0 && subgroups.length === 0;

        return (
          <div key={category.id}>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-pink-50">
                <Icon className="h-5 w-5 text-pink-700" />
              </div>
              <h3 className="font-display text-xl text-ink-900">{category.name}</h3>
            </div>
            {category.note && <p className="mt-2 text-sm text-ink-700">{category.note}</p>}
            {isEmpty && !category.note && <p className="mt-3 text-sm text-ink-700">Предстои — очаквайте скоро.</p>}

            {items.length > 0 && (
              <div className="mt-4">
                <MenuItemGrid items={items} onOpen={setSelected} />
              </div>
            )}
            {subgroups.map((subgroup) => (
              <div key={subgroup.id} className="mt-6">
                <h4 className="text-sm font-semibold uppercase tracking-[0.15em] text-ink-700">{subgroup.name}</h4>
                <div className="mt-3">
                  <MenuItemGrid items={subgroup.items} onOpen={setSelected} />
                </div>
              </div>
            ))}
          </div>
        );
      })}

      {selected && <MenuDetailsPanel key={selected.id} item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
