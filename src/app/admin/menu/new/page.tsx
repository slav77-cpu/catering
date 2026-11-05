import type { Metadata } from "next";
import { MenuItemForm } from "@/components/admin/MenuItemForm";
import { PageTitle, parseMenuType } from "@/components/admin/ui";
import { getCategoryOptions } from "@/lib/admin/data";

export const metadata: Metadata = { title: "Нов артикул" };

export default async function NewMenuItemPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  const menuType = parseMenuType(type);
  const categories = await getCategoryOptions(menuType);

  return (
    <>
      <PageTitle title="Нов артикул" />
      <MenuItemForm item={null} menuType={menuType} categories={categories} />
    </>
  );
}
