import "server-only";
import type { GalleryImage, MenuCategory, MenuItem } from "@/data/types";
import type { MenuType } from "@/generated/prisma/client";
import { cloudinaryUrl } from "@/lib/cloudinary";
import { db } from "@/lib/db";
import { categoryStockPhoto } from "@/lib/stockImages";

type ItemRow = {
  id: string;
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
};

function toMenuItem(row: ItemRow, fallbackPhotoUrl: string | undefined): MenuItem {
  const ownPhotoUrl = row.imagePublicId ? cloudinaryUrl(row.imagePublicId) : undefined;
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    portion: row.portion ?? undefined,
    note: row.note ?? undefined,
    vegetarian: row.isVegetarian,
    priceEur: Number(row.priceEur),
    priceBgn: Number(row.priceBgn),
    allergens: row.allergens,
    imageUrl: ownPhotoUrl ?? fallbackPhotoUrl,
    // A category photo isn't a picture of this dish, so its alt falls back to the name.
    imageAlt: (ownPhotoUrl && row.imageAlt) || row.name,
  };
}

const visibleItems = {
  where: { isVisible: true },
  orderBy: { sortOrder: "asc" },
} as const;

/** Visible categories and items, in the client's chosen order. */
export async function getPublicMenu(type: MenuType): Promise<MenuCategory[]> {
  const categories = await db.menuCategory.findMany({
    where: { type, parentId: null, isVisible: true },
    orderBy: { sortOrder: "asc" },
    include: {
      items: visibleItems,
      children: {
        where: { isVisible: true },
        orderBy: { sortOrder: "asc" },
        include: { items: visibleItems },
      },
    },
  });

  return categories.map((category) => {
    const categoryPhoto = categoryStockPhoto(category.id);
    return {
      id: category.id,
      name: category.name,
      note: category.note ?? undefined,
      items: category.items.map((item) => toMenuItem(item, categoryPhoto)),
      subgroups: category.children.map((child) => ({
        id: child.id,
        name: child.name,
        items: child.items.map((item) => toMenuItem(item, categoryStockPhoto(child.id) ?? categoryPhoto)),
      })),
    };
  });
}

export async function getPublicGallery(): Promise<GalleryImage[]> {
  const photos = await db.galleryPhoto.findMany({
    where: { isVisible: true, alt: { not: "" } },
    orderBy: { sortOrder: "asc" },
  });

  return photos.flatMap((photo) => {
    const src = cloudinaryUrl(photo.publicId);
    if (!src) return [];
    return [
      {
        id: photo.id,
        src,
        alt: photo.alt,
        caption: photo.caption ?? undefined,
        width: photo.width,
        height: photo.height,
      },
    ];
  });
}
