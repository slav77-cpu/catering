import "server-only";
import type { MenuType } from "@/generated/prisma/client";
import { requireAdminPage } from "@/lib/auth";
import { cloudinaryUrl } from "@/lib/cloudinary";
import { db } from "@/lib/db";
import { categoryStockPhoto } from "@/lib/stockImages";
import type { AdminCategory, AdminMenuGroup, AdminMenuItem, AdminPhoto, CategoryOption } from "@/lib/admin/types";

// Every read here checks the session itself: layouts don't re-run on client-side
// navigation, so a check in the admin layout alone wouldn't protect them.

type PhotoRow = {
  id: string;
  publicId: string;
  alt: string;
  caption: string | null;
  eventDate: Date | null;
  isVisible: boolean;
};

export function toAdminPhoto(photo: PhotoRow): AdminPhoto {
  return {
    id: photo.id,
    src: cloudinaryUrl(photo.publicId) ?? "",
    alt: photo.alt,
    caption: photo.caption ?? "",
    eventDate: photo.eventDate?.toISOString().slice(0, 10) ?? "",
    isVisible: photo.isVisible,
  };
}

type ItemRow = {
  id: string;
  categoryId: string;
  name: string;
  description: string | null;
  portion: string | null;
  note: string | null;
  isVegetarian: boolean;
  priceEur: unknown;
  priceBgn: unknown;
  allergens: number[];
  imagePublicId: string | null;
  imageAlt: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
  isVisible: boolean;
};

function toAdminItem(item: ItemRow): AdminMenuItem {
  const src = item.imagePublicId ? cloudinaryUrl(item.imagePublicId) : undefined;
  return {
    id: item.id,
    categoryId: item.categoryId,
    name: item.name,
    description: item.description ?? "",
    portion: item.portion ?? "",
    note: item.note ?? "",
    isVegetarian: item.isVegetarian,
    priceEur: Number(item.priceEur),
    priceBgn: Number(item.priceBgn),
    allergens: item.allergens,
    image:
      item.imagePublicId && src
        ? {
            publicId: item.imagePublicId,
            width: item.imageWidth ?? 0,
            height: item.imageHeight ?? 0,
            alt: item.imageAlt ?? "",
            src,
          }
        : null,
    isVisible: item.isVisible,
  };
}

export async function getAdminGallery(): Promise<AdminPhoto[]> {
  await requireAdminPage();
  const photos = await db.galleryPhoto.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
  return photos.map(toAdminPhoto);
}

/** Top-level categories followed by their subcategories, in display order. */
export async function getAdminCategories(type: MenuType): Promise<AdminCategory[]> {
  await requireAdminPage();
  const rows = await db.menuCategory.findMany({
    where: { type },
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { items: true, children: true } } },
  });
  const toCategory = (row: (typeof rows)[number]): AdminCategory => ({
    id: row.id,
    type: row.type,
    name: row.name,
    note: row.note ?? "",
    parentId: row.parentId,
    isVisible: row.isVisible,
    itemCount: row._count.items,
    childCount: row._count.children,
  });
  return rows
    .filter((row) => row.parentId === null)
    .flatMap((parent) => [
      toCategory(parent),
      ...rows.filter((row) => row.parentId === parent.id).map(toCategory),
    ]);
}

/** Every category that holds items, with its items, for the admin menu list. */
export async function getAdminMenuGroups(type: MenuType): Promise<AdminMenuGroup[]> {
  const categories = await getAdminCategories(type);
  const items = await db.menuItem.findMany({
    where: { categoryId: { in: categories.map((category) => category.id) } },
    orderBy: { sortOrder: "asc" },
  });
  const nameById = new Map(categories.map((category) => [category.id, category.name]));

  return categories
    .filter((category) => category.childCount === 0)
    .map((category) => ({
      id: category.id,
      name: category.parentId ? `${nameById.get(category.parentId)} → ${category.name}` : category.name,
      isVisible: category.isVisible,
      items: items.filter((item) => item.categoryId === category.id).map(toAdminItem),
    }));
}

export async function getCategoryOptions(type: MenuType): Promise<CategoryOption[]> {
  const categories = await getAdminCategories(type);
  const nameById = new Map(categories.map((category) => [category.id, category.name]));

  return categories
    .filter((category) => category.childCount === 0)
    .map((category) => ({
      id: category.id,
      name: category.name,
      group: category.parentId ? nameById.get(category.parentId) : undefined,
      fallbackPhotoUrl:
        categoryStockPhoto(category.id) ?? (category.parentId ? categoryStockPhoto(category.parentId) : undefined),
    }));
}

export async function getAdminMenuItem(id: string): Promise<{ item: AdminMenuItem; type: MenuType } | null> {
  await requireAdminPage();
  const row = await db.menuItem.findUnique({ where: { id }, include: { category: { select: { type: true } } } });
  return row ? { item: toAdminItem(row), type: row.category.type } : null;
}

export async function getAdminCounts() {
  await requireAdminPage();
  const [photos, hiddenPhotos, items, hiddenItems] = await Promise.all([
    db.galleryPhoto.count(),
    db.galleryPhoto.count({ where: { isVisible: false } }),
    db.menuItem.count(),
    db.menuItem.count({ where: { isVisible: false } }),
  ]);
  return { photos, hiddenPhotos, items, hiddenItems };
}
