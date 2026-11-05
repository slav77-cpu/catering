"use client";

import { signIn } from "next-auth/react";
import { useState, type FormEvent } from "react";
import { ErrorMessage, Field, buttonClass, inputClass } from "@/components/admin/ui";

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    const form = new FormData(event.currentTarget);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: form.get("email"),
        password: form.get("password"),
      });
      if (result?.ok && !result.error) {
        window.location.assign(callbackUrl);
        return;
      }
      setError(
        result?.error === "RATE_LIMITED"
          ? "Твърде много опити за вход. Опитайте отново след 15 минути."
          : "Грешен имейл или парола.",
      );
    } catch {
      setError("Няма връзка със сървъра. Проверете интернета и опитайте отново.");
    }
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Имейл" htmlFor="email">
        <input id="email" name="email" type="email" required autoComplete="username" className={inputClass} />
      </Field>
      <Field label="Парола" htmlFor="password">
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={inputClass}
        />
      </Field>
      <ErrorMessage>{error}</ErrorMessage>
      <button type="submit" disabled={submitting} className={`${buttonClass.primary} w-full`}>
        {submitting ? "Влизане…" : "Вход"}
      </button>
    </form>
  );
}
