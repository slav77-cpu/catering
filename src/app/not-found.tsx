import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Страницата не е намерена",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-pink-700">404</p>
          <h1 className="mt-3 font-display text-4xl text-ink-900">Тази страница я няма в менюто</h1>
          <p className="mt-4 text-ink-700">Адресът може да е грешен или страницата да е преместена.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/">Към началото</Button>
            <Button href="/restaurant" variant="secondary">
              Виж менюто
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
