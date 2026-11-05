import { loadEnvConfig } from "@next/env";
import { PrismaPg } from "@prisma/adapter-pg";
import { cateringMenuCategories } from "../src/data/cateringContent";
import { restaurantMenu } from "../src/data/restaurantMenu";
import type { MenuItem } from "../src/data/types";
import { MenuType, PrismaClient } from "../src/generated/prisma/client";

loadEnvConfig(process.cwd());

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set.");
}

const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

type SeedCategory = {
  id: string;
  name: string;
  note?: string;
  items?: MenuItem[];
  subgroups?: SeedCategory[];
};

async function createCategory(
  category: SeedCategory,
  type: MenuType,
  sortOrder: number,
  parentId: string | null,
): Promise<number> {
  await db.menuCategory.create({
    data: { id: category.id, type, name: category.name, note: category.note, parentId, sortOrder },
  });

  const items = category.items ?? [];
  await db.menuItem.createMany({
    data: items.map((item, index) => ({
      id: item.id,
      categoryId: category.id,
      name: item.name,
      description: item.description,
      portion: item.portion,
      note: item.note,
      isVegetarian: item.vegetarian ?? false,
      priceEur: item.priceEur,
      priceBgn: item.priceBgn,
      allergens: item.allergens ?? [],
      sortOrder: index,
    })),
  });

  let created = items.length;
  for (const [index, subgroup] of (category.subgroups ?? []).entries()) {
    created += await createCategory(subgroup, type, index, category.id);
  }
  return created;
}

async function main() {
  // Once the client has edited anything the database is the source of truth.
  // Re-running this must never overwrite their prices or bring back deleted items.
  const existing = await db.menuCategory.count();
  if (existing > 0) {
    console.log(`Seed skipped: the database already has ${existing} categories.`);
    return;
  }

  const menus: [MenuType, SeedCategory[]][] = [
    [MenuType.RESTAURANT, restaurantMenu],
    [MenuType.CATERING, cateringMenuCategories],
  ];

  for (const [type, categories] of menus) {
    let items = 0;
    for (const [index, category] of categories.entries()) {
      items += await createCategory(category, type, index, null);
    }
    console.log(`${type}: ${categories.length} categories, ${items} items`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
