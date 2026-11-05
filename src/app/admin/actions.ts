"use server";

import { z } from "zod";
import { allergenLegend } from "@/data/allergens";
import { getAdmin } from "@/lib/auth";
import { deleteCloudinaryImage } from "@/lib/cloudinary";
import { db } from "@/lib/db";
import { getAdminCategories, toAdminPhoto } from "@/lib/admin/data";
import type { ActionResult, AdminCategory, AdminPhoto, MoveDirection } from "@/lib/admin/types";

// Server Actions are reachable by direct POST regardless of the page they're used
// on, so each one goes through adminAction() and validates its own input.

function fail(error: string): { ok: false; error: string } {
  return { ok: false, error };
}

function ok<T>(data: T): { ok: true; data: T } {
  return { ok: true, data };
}

async function adminAction<T>(work: () => Promise<ActionResult<T>>): Promise<ActionResult<T>> {
  if (!(await getAdmin())) return fail("Сесията ви е изтекла. Влезте отново.");
  try {
    return await work();
  } catch (error) {
    console.error("[admin action]", error);
    return fail("Промяната не беше запазена. Опитайте отново.");
  }
}

function firstIssue(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Невалидни данни.";
}

const optionalText = (max: number) => z.string().trim().max(max, `Текстът е твърде дълъг (до ${max} знака).`);
const id = z.string().min(1);
const direction = z.enum(["up", "down"]);
const cloudinaryImage = {
  publicId: z.string().min(1).max(255),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
};

function dbDate(value: string): Date | null {
  return value ? new Date(`${value}T00:00:00.000Z`) : null;
}

/** The sibling list after swapping `id` with its neighbour, or null at either end. */
function afterMove<T extends { id: string }>(rows: T[], id: string, dir: MoveDirection): T[] | null {
  const from = rows.findIndex((row) => row.id === id);
  const to = from + (dir === "up" ? -1 : 1);
  if (from < 0 || to < 0 || to >= rows.length) return null;
  const next = [...rows];
  [next[from], next[to]] = [next[to], next[from]];
  return next;
}

// ---------------------------------------------------------------- Gallery

const newPhotoInput = z.object({
  ...cloudinaryImage,
  eventDate: z.iso.date().or(z.literal("")),
});

export async function addGalleryPhoto(input: z.input<typeof newPhotoInput>): Promise<ActionResult<AdminPhoto>> {
  return adminAction(async () => {
    const parsed = newPhotoInput.safeParse(input);
    if (!parsed.success) return fail(firstIssue(parsed.error));
    const { publicId, width, height, eventDate } = parsed.data;

    const first = await db.galleryPhoto.aggregate({ _min: { sortOrder: true } });
    const photo = await db.galleryPhoto.upsert({
      where: { publicId },
      update: { width, height },
      // Hidden until described, and placed first: the newest event leads the gallery.
      create: {
        publicId,
        width,
        height,
        eventDate: dbDate(eventDate),
        isVisible: false,
        sortOrder: (first._min.sortOrder ?? 1) - 1,
      },
    });
    return ok(toAdminPhoto(photo));
  });
}

const photoInput = z
  .object({
    alt: optionalText(300),
    caption: optionalText(300),
    eventDate: z.iso.date().or(z.literal("")),
    isVisible: z.boolean(),
  })
  .refine((photo) => !photo.isVisible || photo.alt.length > 0, {
    error: "Снимка на сайта трябва да има описание.",
  });

export async function updateGalleryPhoto(
  photoId: string,
  input: z.input<typeof photoInput>,
): Promise<ActionResult<AdminPhoto>> {
  return adminAction(async () => {
    const parsed = photoInput.safeParse(input);
    if (!parsed.success) return fail(firstIssue(parsed.error));
    const { alt, caption, eventDate, isVisible } = parsed.data;

    const photo = await db.galleryPhoto.update({
      where: { id: id.parse(photoId) },
      data: { alt, caption: caption || null, eventDate: dbDate(eventDate), isVisible },
    });
    return ok(toAdminPhoto(photo));
  });
}

export async function moveGalleryPhoto(photoId: string, dir: MoveDirection): Promise<ActionResult> {
  return adminAction(async () => {
    const rows = await db.galleryPhoto.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      select: { id: true },
    });
    const next = afterMove(rows, id.parse(photoId), direction.parse(dir));
    if (next) {
      await db.$transaction(
        next.map((row, index) => db.galleryPhoto.update({ where: { id: row.id }, data: { sortOrder: index } })),
      );
    }
    return ok(null);
  });
}

export async function deleteGalleryPhoto(photoId: string): Promise<ActionResult> {
  return adminAction(async () => {
    const photo = await db.galleryPhoto.delete({ where: { id: id.parse(photoId) } });
    await deleteCloudinaryImage(photo.publicId);
    return ok(null);
  });
}

// ---------------------------------------------------------------- Menu items

const allergenCodes = allergenLegend.map((allergen) => allergen.code);
const price = z
  .number({ error: "Въведете валидна цена." })
  .min(0, "Цената не може да е отрицателна.")
  .max(100000, "Цената е твърде висока.")
  .transform((value) => Math.round(value * 100) / 100);

const menuItemInput = z.object({
  categoryId: id,
  name: z.string().trim().min(1, "Името е задължително.").max(160, "Името е твърде дълго."),
  description: optionalText(1000),
  portion: optionalText(40),
  note: optionalText(300),
  isVegetarian: z.boolean(),
  priceEur: price,
  priceBgn: price,
  allergens: z.array(z.number().int().refine((code) => allergenCodes.includes(code))),
  image: z
    .object({
      ...cloudinaryImage,
      alt: z
        .string()
        .trim()
        .min(1, "Описанието на снимката е задължително.")
        .max(300, "Описанието на снимката е твърде дълго."),
    })
    .nullable(),
  isVisible: z.boolean(),
});

export async function saveMenuItem(
  itemId: string | null,
  input: z.input<typeof menuItemInput>,
): Promise<ActionResult<{ id: string }>> {
  return adminAction(async () => {
    const parsed = menuItemInput.safeParse(input);
    if (!parsed.success) return fail(firstIssue(parsed.error));
    const { image, description, portion, note, ...fields } = parsed.data;

    const data = {
      ...fields,
      description: description || null,
      portion: portion || null,
      note: note || null,
      imagePublicId: image?.publicId ?? null,
      imageAlt: image?.alt ?? null,
      imageWidth: image?.width ?? null,
      imageHeight: image?.height ?? null,
    };

    const nextSortOrder = async () => {
      const last = await db.menuItem.aggregate({
        where: { categoryId: fields.categoryId },
        _max: { sortOrder: true },
      });
      return (last._max.sortOrder ?? -1) + 1;
    };

    if (!itemId) {
      const created = await db.menuItem.create({ data: { ...data, sortOrder: await nextSortOrder() } });
      return ok({ id: created.id });
    }

    const existing = await db.menuItem.findUnique({ where: { id: id.parse(itemId) } });
    if (!existing) return fail("Този артикул вече не съществува.");

    await db.menuItem.update({
      where: { id: existing.id },
      data: {
        ...data,
        // Moving to another category places the item last there.
        ...(existing.categoryId !== fields.categoryId ? { sortOrder: await nextSortOrder() } : {}),
      },
    });
    if (existing.imagePublicId && existing.imagePublicId !== data.imagePublicId) {
      await deleteCloudinaryImage(existing.imagePublicId);
    }
    return ok({ id: existing.id });
  });
}

export async function setMenuItemVisible(itemId: string, isVisible: boolean): Promise<ActionResult> {
  return adminAction(async () => {
    await db.menuItem.update({ where: { id: id.parse(itemId) }, data: { isVisible: z.boolean().parse(isVisible) } });
    return ok(null);
  });
}

export async function moveMenuItem(itemId: string, dir: MoveDirection): Promise<ActionResult> {
  return adminAction(async () => {
    const item = await db.menuItem.findUnique({ where: { id: id.parse(itemId) } });
    if (!item) return fail("Този артикул вече не съществува.");

    const siblings = await db.menuItem.findMany({
      where: { categoryId: item.categoryId },
      orderBy: { sortOrder: "asc" },
      select: { id: true },
    });
    const next = afterMove(siblings, item.id, direction.parse(dir));
    if (next) {
      await db.$transaction(
        next.map((row, index) => db.menuItem.update({ where: { id: row.id }, data: { sortOrder: index } })),
      );
    }
    return ok(null);
  });
}

export async function deleteMenuItem(itemId: string): Promise<ActionResult> {
  return adminAction(async () => {
    const item = await db.menuItem.delete({ where: { id: id.parse(itemId) } });
    if (item.imagePublicId) await deleteCloudinaryImage(item.imagePublicId);
    return ok(null);
  });
}

// ---------------------------------------------------------------- Categories

const categoryFields = z.object({
  name: z.string().trim().min(1, "Името е задължително.").max(80, "Името е твърде дълго."),
  note: optionalText(300),
});
const menuType = z.enum(["RESTAURANT", "CATERING"]);

export async function createCategory(
  type: "RESTAURANT" | "CATERING",
  parentId: string | null,
  input: z.input<typeof categoryFields>,
): Promise<ActionResult<AdminCategory[]>> {
  return adminAction(async () => {
    const parsed = categoryFields.safeParse(input);
    if (!parsed.success) return fail(firstIssue(parsed.error));
    const menu = menuType.parse(type);

    if (parentId) {
      const parent = await db.menuCategory.findUnique({ where: { id: id.parse(parentId) } });
      if (!parent || parent.parentId) return fail("Подкатегории могат да се добавят само към основна категория.");
      if (parent.type !== menu) return fail("Невалидна основна категория.");
      if (await db.menuItem.count({ where: { categoryId: parent.id } })) {
        return fail("Преместете артикулите на тази категория, преди да ѝ добавите подкатегории.");
      }
    }

    const last = await db.menuCategory.aggregate({
      where: { type: menu, parentId },
      _max: { sortOrder: true },
    });
    await db.menuCategory.create({
      data: {
        type: menu,
        parentId,
        name: parsed.data.name,
        note: parsed.data.note || null,
        sortOrder: (last._max.sortOrder ?? -1) + 1,
      },
    });
    return ok(await getAdminCategories(menu));
  });
}

export async function updateCategory(
  categoryId: string,
  input: z.input<typeof categoryFields> & { isVisible: boolean },
): Promise<ActionResult<AdminCategory[]>> {
  return adminAction(async () => {
    const parsed = categoryFields.safeParse(input);
    if (!parsed.success) return fail(firstIssue(parsed.error));

    const category = await db.menuCategory.update({
      where: { id: id.parse(categoryId) },
      data: {
        name: parsed.data.name,
        note: parsed.data.note || null,
        isVisible: z.boolean().parse(input.isVisible),
      },
    });
    return ok(await getAdminCategories(category.type));
  });
}

export async function moveCategory(categoryId: string, dir: MoveDirection): Promise<ActionResult<AdminCategory[]>> {
  return adminAction(async () => {
    const category = await db.menuCategory.findUnique({ where: { id: id.parse(categoryId) } });
    if (!category) return fail("Тази категория вече не съществува.");

    const siblings = await db.menuCategory.findMany({
      where: { type: category.type, parentId: category.parentId },
      orderBy: { sortOrder: "asc" },
      select: { id: true },
    });
    const next = afterMove(siblings, category.id, direction.parse(dir));
    if (next) {
      await db.$transaction(
        next.map((row, index) => db.menuCategory.update({ where: { id: row.id }, data: { sortOrder: index } })),
      );
    }
    return ok(await getAdminCategories(category.type));
  });
}

export async function deleteCategory(categoryId: string): Promise<ActionResult<AdminCategory[]>> {
  return adminAction(async () => {
    const category = await db.menuCategory.findUnique({
      where: { id: id.parse(categoryId) },
      include: { _count: { select: { items: true, children: true } } },
    });
    if (!category) return fail("Тази категория вече не съществува.");
    if (category._count.items > 0 || category._count.children > 0) {
      return fail("Можете да изтриете само празна категория. Първо преместете или изтрийте съдържанието ѝ.");
    }
    await db.menuCategory.delete({ where: { id: category.id } });
    return ok(await getAdminCategories(category.type));
  });
}
