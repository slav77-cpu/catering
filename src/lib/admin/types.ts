import type { MenuType } from "@/generated/prisma/client";

export type ActionResult<T = null> = { ok: true; data: T } | { ok: false; error: string };

export type MoveDirection = "up" | "down";

export type AdminPhoto = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  /** yyyy-mm-dd, or "" when not set */
  eventDate: string;
  isVisible: boolean;
};

export type AdminCategory = {
  id: string;
  type: MenuType;
  name: string;
  note: string;
  parentId: string | null;
  isVisible: boolean;
  itemCount: number;
  childCount: number;
};

export type AdminMenuImage = {
  publicId: string;
  width: number;
  height: number;
  alt: string;
  src: string;
};

export type AdminMenuItem = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  portion: string;
  note: string;
  isVegetarian: boolean;
  priceEur: number;
  priceBgn: number;
  allergens: number[];
  image: AdminMenuImage | null;
  isVisible: boolean;
};

export type AdminMenuGroup = {
  id: string;
  name: string;
  isVisible: boolean;
  items: AdminMenuItem[];
};

/** One choice in the item form's category select. */
export type CategoryOption = {
  id: string;
  name: string;
  /** Parent category's name, for subcategories. */
  group?: string;
  /** Shown in the preview when the item has no photo of its own. */
  fallbackPhotoUrl?: string;
};
