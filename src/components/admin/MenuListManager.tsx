"use client";

import Link from "next/link";
import { useState } from "react";
import { moveMenuItem, setMenuItemVisible } from "@/app/admin/actions";
import { SiteImage } from "@/components/SiteImage";
import { ErrorMessage, StatusBadge, buttonClass, callAction, iconButtonClass, inputClass } from "@/components/admin/ui";
import type { AdminMenuGroup, AdminMenuItem, MoveDirection } from "@/lib/admin/types";
import { formatPrice } from "@/lib/format";

export function MenuListManager({ initialGroups }: { initialGroups: AdminMenuGroup[] }) {
  const [groups, setGroups] = useState(initialGroups);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const needle = query.trim().toLowerCase();

  function updateItems(groupId: string, update: (items: AdminMenuItem[]) => AdminMenuItem[]) {
    setGroups((current) =>
      current.map((group) => (group.id === groupId ? { ...group, items: update(group.items) } : group)),
    );
  }

  async function handleVisibility(groupId: string, item: AdminMenuItem) {
    setError("");
    const result = await callAction(() => setMenuItemVisible(item.id, !item.isVisible));
    if (!result.ok) {
      setError(result.error);
      return;
    }
    updateItems(groupId, (items) =>
      items.map((existing) => (existing.id === item.id ? { ...existing, isVisible: !item.isVisible } : existing)),
    );
  }

  async function handleMove(groupId: string, item: AdminMenuItem, direction: MoveDirection) {
    setError("");
    const result = await callAction(() => moveMenuItem(item.id, direction));
    if (!result.ok) {
      setError(result.error);
      return;
    }
    updateItems(groupId, (items) => {
      const next = [...items];
      const from = next.findIndex((existing) => existing.id === item.id);
      const to = from + (direction === "up" ? -1 : 1);
      if (from >= 0 && next[to]) [next[from], next[to]] = [next[to], next[from]];
      return next;
    });
  }

  return (
    <div className="space-y-6">
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Търси артикул…"
        aria-label="Търси артикул"
        className={inputClass}
      />
      <ErrorMessage>{error}</ErrorMessage>

      {groups.map((group) => {
        const items = group.items.filter((item) => item.name.toLowerCase().includes(needle));
        if (needle && items.length === 0) return null;

        return (
          <section key={group.id}>
            <h2 className="mb-2 flex items-center gap-2 font-display text-lg text-ink-900">
              {group.name}
              {!group.isVisible && <StatusBadge visible={false} label="Скрита категория" />}
            </h2>
            {items.length === 0 ? (
              <p className="rounded-xl border border-dashed border-line p-4 text-sm text-ink-700">Няма артикули.</p>
            ) : (
              <ul className="space-y-2">
                {items.map((item) => {
                  const position = group.items.indexOf(item);
                  return (
                    <li
                      key={item.id}
                      className="rounded-2xl border border-line bg-white p-3"
                      data-testid="admin-menu-item"
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-line/40 text-center text-[10px] leading-tight text-ink-700">
                          {item.image ? (
                            <SiteImage src={item.image.src} alt={item.image.alt} fill sizes="56px" className="object-cover" />
                          ) : (
                            "без снимка"
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-ink-900">{item.name}</p>
                          <p className="text-sm text-ink-700">{formatPrice(item.priceEur, item.priceBgn)}</p>
                          <div className="mt-1">
                            <StatusBadge visible={item.isVisible} />
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <Link href={`/admin/menu/${item.id}`} className={buttonClass.primary}>
                          Редактирай
                        </Link>
                        <button
                          type="button"
                          onClick={() => void handleVisibility(group.id, item)}
                          className={buttonClass.secondary}
                        >
                          {item.isVisible ? "Скрий" : "Покажи"}
                        </button>
                        {!needle && (
                          <div className="ml-auto flex gap-2">
                            <button
                              type="button"
                              onClick={() => void handleMove(group.id, item, "up")}
                              disabled={position === 0}
                              aria-label={`Премести ${item.name} нагоре`}
                              className={iconButtonClass}
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleMove(group.id, item, "down")}
                              disabled={position === group.items.length - 1}
                              aria-label={`Премести ${item.name} надолу`}
                              className={iconButtonClass}
                            >
                              ↓
                            </button>
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
