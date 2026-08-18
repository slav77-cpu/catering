"use client";

import Link from "next/link";
import { useState } from "react";
import { navLinks, site } from "@/data/site";
import { CloseIcon, MenuIcon, PhoneIcon } from "@/components/icons";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex flex-col leading-none" onClick={() => setOpen(false)}>
          <span className="font-display text-lg tracking-wide text-ink-900 sm:text-xl">
            {site.restaurantName}
          </span>
          <span className="text-[10px] uppercase tracking-[0.25em] text-pink-500">
            Ramen · Poke · Sushi
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-700 transition-colors hover:text-pink-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <a
            href={`tel:${site.phoneRestaurant.replace(/\s+/g, "")}`}
            className="inline-flex items-center gap-2 rounded-full bg-pink-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-pink-600"
          >
            <PhoneIcon className="h-4 w-4" />
            {site.phoneRestaurant}
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Затвори менюто" : "Отвори менюто"}
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-full text-ink-900 md:hidden"
        >
          {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-cream md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-4 py-2 sm:px-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-line/70 py-3 text-base font-medium text-ink-900 last:border-none"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`tel:${site.phoneRestaurant.replace(/\s+/g, "")}`}
              className="my-3 inline-flex items-center justify-center gap-2 rounded-full bg-pink-500 px-4 py-3 text-sm font-medium text-white"
            >
              <PhoneIcon className="h-4 w-4" />
              Обади се: {site.phoneRestaurant}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
