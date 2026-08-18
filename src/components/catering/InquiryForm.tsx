"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { packageTiers } from "@/data/cateringContent";

const eventTypeOptions = [
  { value: "firmeno", label: "Фирмено" },
  { value: "svatba", label: "Сватба" },
  { value: "rojden-den", label: "Рожден ден" },
  { value: "drugo", label: "Друго" },
];

type Status = "idle" | "submitting" | "success" | "error";

export function InquiryForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/catering-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center text-green-800">
        <p className="font-display text-xl">Благодарим!</p>
        <p className="mt-2 text-sm">
          Получихме запитването ви и ще се свържем с вас по телефона, за да уточним детайлите.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
      <Field label="Име" htmlFor="name">
        <input id="name" name="name" type="text" required className={inputClasses} />
      </Field>
      <Field label="Телефон" htmlFor="phone">
        <input id="phone" name="phone" type="tel" required className={inputClasses} />
      </Field>
      <Field label="Имейл" htmlFor="email">
        <input id="email" name="email" type="email" required className={inputClasses} />
      </Field>
      <Field label="Дата на събитието" htmlFor="eventDate">
        <input id="eventDate" name="eventDate" type="date" required className={inputClasses} />
      </Field>
      <Field label="Брой гости" htmlFor="guestCount">
        <input id="guestCount" name="guestCount" type="number" min={1} required className={inputClasses} />
      </Field>
      <Field label="Тип събитие" htmlFor="eventType">
        <select id="eventType" name="eventType" required className={inputClasses}>
          <option value="">Изберете…</option>
          {eventTypeOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Избран пакет (по избор)" htmlFor="packageTier">
        <select id="packageTier" name="packageTier" className={inputClasses}>
          <option value="">Нямам предпочитание</option>
          {packageTiers.map((p) => (
            <option key={p.id} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Съобщение" htmlFor="message" full>
        <textarea id="message" name="message" rows={4} className={inputClasses} placeholder="Разкажете ни повече за събитието…" />
      </Field>

      <div className="sm:col-span-2">
        {status === "error" && (
          <p className="mb-3 text-sm text-pink-700">
            Възникна проблем при изпращането. Моля, опитайте отново или ни се обадете директно.
          </p>
        )}
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex w-full items-center justify-center rounded-full bg-pink-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-pink-600 disabled:opacity-60 sm:w-auto"
        >
          {status === "submitting" ? "Изпращане…" : "Изпрати запитване"}
        </button>
      </div>
    </form>
  );
}

const inputClasses =
  "w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-500 focus:border-pink-400 focus:outline-none";

function Field({
  label,
  htmlFor,
  children,
  full = false,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : undefined}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink-900">
        {label}
      </label>
      {children}
    </div>
  );
}
