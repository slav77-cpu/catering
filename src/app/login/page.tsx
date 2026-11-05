import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { site } from "@/data/site";
import { getAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Вход",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string | string[] }>;
}) {
  const { callbackUrl } = await searchParams;
  // Only ever back into the admin panel, so this can't be used as an open redirect.
  const target = typeof callbackUrl === "string" && callbackUrl.startsWith("/admin") ? callbackUrl : "/admin";

  if (await getAdmin()) redirect(target);

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm rounded-3xl border border-line bg-white p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pink-700">{site.restaurantName}</p>
        <h1 className="mt-1 mb-6 font-display text-2xl text-ink-900">Вход в админ панела</h1>
        <LoginForm callbackUrl={target} />
      </div>
    </main>
  );
}
