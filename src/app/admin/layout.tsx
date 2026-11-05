import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { SignOutButton } from "@/components/admin/SignOutButton";
import { site } from "@/data/site";
import { requireAdminPage } from "@/lib/auth";

export const metadata: Metadata = {
  title: { default: "Админ панел", template: `%s | Админ — ${site.restaurantName}` },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdminPage();

  return (
    <>
      {/* No backdrop-filter here: it would make this the containing block for AdminNav,
          pinning its fixed bottom bar to the header instead of the viewport. */}
      <header className="sticky top-0 z-20 border-b border-line bg-cream">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between gap-4 px-4">
          <Link href="/admin" className="font-display text-lg text-ink-900">
            {site.restaurantName}
          </Link>
          <AdminNav />
          <SignOutButton />
        </div>
      </header>
      <main className="flex-1 pb-28 md:pb-12">
        <div className="mx-auto max-w-4xl px-4 py-6">{children}</div>
      </main>
    </>
  );
}
