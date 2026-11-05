import type { Metadata } from "next";
import Link from "next/link";
import { MenuListManager } from "@/components/admin/MenuListManager";
import { MenuTypeTabs, PageTitle, buttonClass, parseMenuType } from "@/components/admin/ui";
import { getAdminMenuGroups } from "@/lib/admin/data";

export const metadata: Metadata = { title: "Меню" };

export default async function AdminMenuPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; saved?: string }>;
}) {
  const { type, saved } = await searchParams;
  const menuType = parseMenuType(type);
  const groups = await getAdminMenuGroups(menuType);
  const newItemHref = menuType === "CATERING" ? "/admin/menu/new?type=catering" : "/admin/menu/new";

  return (
    <>
      <PageTitle title="Меню">
        <Link href={newItemHref} className={buttonClass.primary}>
          + Нов артикул
        </Link>
      </PageTitle>
      <MenuTypeTabs basePath="/admin/menu" active={menuType} />
      {saved && (
        <p role="status" className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Запазено: {saved}. Промяната вече се вижда в сайта.
        </p>
      )}
      {/* Remount on tab change: the list keeps its own state after the first render. */}
      <MenuListManager key={menuType} initialGroups={groups} />
    </>
  );
}
