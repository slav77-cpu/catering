import type { Metadata } from "next";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { MenuTypeTabs, PageTitle, parseMenuType } from "@/components/admin/ui";
import { getAdminCategories } from "@/lib/admin/data";

export const metadata: Metadata = { title: "Категории" };

export default async function AdminCategoriesPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  const menuType = parseMenuType(type);
  const categories = await getAdminCategories(menuType);

  return (
    <>
      <PageTitle title="Категории" />
      <MenuTypeTabs basePath="/admin/categories" active={menuType} />
      {/* Remount on tab change: the manager keeps its own state after the first render. */}
      <CategoryManager key={menuType} menuType={menuType} initialCategories={categories} />
    </>
  );
}
