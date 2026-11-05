import Link from "next/link";
import type { ReactNode } from "react";
import type { ActionResult } from "@/lib/admin/types";

// Everything tappable is at least 44px tall: this panel is used one-handed on a phone.

export const inputClass =
  "block min-h-11 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-base text-ink-900 placeholder:text-ink-500 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 aria-[invalid=true]:border-pink-700";

const buttonBase =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50";

export const buttonClass = {
  primary: `${buttonBase} bg-pink-600 text-white hover:bg-pink-700`,
  secondary: `${buttonBase} border border-line bg-white text-ink-900 hover:border-pink-400`,
  danger: `${buttonBase} border border-pink-700 bg-white text-pink-700 hover:bg-pink-50`,
};

export const iconButtonClass =
  "inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-lg text-ink-900 transition-colors hover:border-pink-400 disabled:cursor-not-allowed disabled:opacity-40";

export function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-ink-900">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-ink-700">{hint}</p>}
    </div>
  );
}

export function ErrorMessage({ children }: { children: ReactNode }) {
  if (!children) return null;
  return (
    <p role="alert" className="rounded-xl border border-pink-200 bg-pink-50 px-4 py-3 text-sm text-pink-700">
      {children}
    </p>
  );
}

export function StatusBadge({ visible, label }: { visible: boolean; label?: string }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
        visible ? "bg-green-100 text-green-800" : "bg-line/60 text-ink-700"
      }`}
    >
      {label ?? (visible ? "На сайта" : "Скрит")}
    </span>
  );
}

export function PageTitle({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <h1 className="font-display text-2xl text-ink-900 sm:text-3xl">{title}</h1>
      {children}
    </div>
  );
}

export function MenuTypeTabs({ basePath, active }: { basePath: string; active: "RESTAURANT" | "CATERING" }) {
  const tabs = [
    { type: "RESTAURANT", label: "Ресторант", href: basePath },
    { type: "CATERING", label: "Кетъринг", href: `${basePath}?type=catering` },
  ];
  return (
    <div className="mb-5 grid grid-cols-2 gap-1 rounded-full border border-line bg-white p-1">
      {tabs.map((tab) => (
        <Link
          key={tab.type}
          href={tab.href}
          aria-current={tab.type === active ? "page" : undefined}
          className={`flex min-h-10 items-center justify-center rounded-full text-sm font-medium ${
            tab.type === active ? "bg-pink-600 text-white" : "text-ink-700"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}

export function parseMenuType(value: unknown): "RESTAURANT" | "CATERING" {
  return value === "catering" ? "CATERING" : "RESTAURANT";
}

/** Runs a Server Action. A failed request throws on the client, which becomes a message here. */
export async function callAction<T>(action: () => Promise<ActionResult<T>>): Promise<ActionResult<T>> {
  try {
    return await action();
  } catch {
    return { ok: false, error: "Няма връзка със сървъра. Проверете интернета и опитайте отново." };
  }
}
