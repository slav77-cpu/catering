"use client";

import { useEffect } from "react";
import { site } from "@/data/site";
import { PhoneIcon } from "@/components/icons";

// Shown when a page can't load its data, e.g. the database is unreachable.
export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <h1 className="font-display text-3xl text-ink-900">Нещо се обърка</h1>
      <p className="mt-3 text-ink-700">
        Страницата не можа да се зареди. Опитайте отново след малко или ни се обадете.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full border border-line bg-white px-6 py-3 text-sm font-medium text-ink-900 hover:border-pink-400"
        >
          Опитай отново
        </button>
        <a
          href={`tel:${site.phoneRestaurant.replace(/\s+/g, "")}`}
          className="inline-flex items-center gap-2 rounded-full bg-pink-600 px-6 py-3 text-sm font-medium text-white hover:bg-pink-700"
        >
          <PhoneIcon className="h-4 w-4" />
          {site.phoneRestaurant}
        </a>
      </div>
    </div>
  );
}
