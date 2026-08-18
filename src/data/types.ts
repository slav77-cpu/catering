export type Allergen = {
  code: number;
  name: string;
};

export type MenuItem = {
  id: string;
  name: string;
  description?: string;
  allergens?: number[];
  vegetarian?: boolean;
  /** e.g. "600г" or "330мл" */
  portion?: string;
  priceEur: number;
  priceBgn: number;
  /** short note shown under the item, e.g. reservation requirements */
  note?: string;
};

export type MenuSubgroup = {
  id: string;
  name: string;
  items: MenuItem[];
};

export type MenuCategory = {
  id: string;
  name: string;
  /** simple category: flat item list */
  items?: MenuItem[];
  /** grouped category, e.g. wines split into white/rosé/red */
  subgroups?: MenuSubgroup[];
  /** category-level note, e.g. "glass wine" pricing or reservation policy */
  note?: string;
};
