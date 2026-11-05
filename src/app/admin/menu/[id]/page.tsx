import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MenuItemForm } from "@/components/admin/MenuItemForm";
import { PageTitle } from "@/components/admin/ui";
import { getAdminMenuItem, getCategoryOptions } from "@/lib/admin/data";

export const metadata: Metadata = { title: "Редакция на артикул" };

export default async function EditMenuItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const found = await getAdminMenuItem(id);
  if (!found) notFound();

  const categories = await getCategoryOptions(found.type);

  return (
    <>
      <PageTitle title={found.item.name} />
      <MenuItemForm item={found.item} menuType={found.type} categories={categories} />
    </>
  );
}
