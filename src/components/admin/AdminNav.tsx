"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Начало", exact: true },
  { href: "/admin/gallery", label: "Снимки" },
  { href: "/admin/menu", label: "Меню" },
  { href: "/admin/categories", label: "Категории" },
];

/** A fixed bottom tab bar on phones, within thumb reach; a plain row from `md` up. */
export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Админ навигация"
      className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-line bg-white pb-[env(safe-area-inset-bottom)] md:static md:flex md:gap-1 md:border-0 md:bg-transparent md:pb-0"
    >
      {links.map((link) => {
        const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-14 items-center justify-center text-sm font-medium md:min-h-10 md:rounded-full md:px-4 ${
              active ? "text-pink-700 md:bg-pink-50" : "text-ink-700 hover:text-pink-700"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
