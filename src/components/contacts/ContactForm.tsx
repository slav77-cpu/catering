"use client";

// Optional short contact form (brief section 6: "по избор кратка контактна
// форма"). Posts JSON to /api/contact with exactly { name, email, message }
// to match the parallel route.ts task built on top of sendInquiryEmail().

import { useState, type FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
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
        <p className="mt-2 text-sm">Ще се свържем с вас скоро.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink-900">
          Име
        </label>
        <input id="name" name="name" type="text" required className={inputClasses} />
      </div>
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink-900">
          Имейл
        </label>
        <input id="email" name="email" type="email" required className={inputClasses} />
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-ink-900">
          Съобщение
        </label>
        <textarea id="message" name="message" rows={4} required className={inputClasses} />
      </div>

      <div>
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
          {status === "submitting" ? "Изпращане…" : "Изпрати съобщение"}
        </button>
      </div>
    </form>
  );
}

const inputClasses =
  "w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-500 focus:border-pink-400 focus:outline-none";
