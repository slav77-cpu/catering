/**
 * Stand-in stock photography, sourced from Unsplash (free for commercial
 * use, no attribution required: https://unsplash.com/license) purely so
 * the site has full visual coverage before the client supplies real
 * photos of their own food, interior and events (brief §9). Every URL
 * below was verified to resolve with a 200 + image content-type at the
 * time it was added.
 *
 * To swap in a real photo: replace the `url` (and update `alt` if the
 * subject changes) for the relevant key below — restaurantMenu.ts,
 * cateringContent.ts, and the home/catering hero sections all read from
 * this single file, so nothing else needs to change.
 */
export const stockImages = {
  "hero-home": {
    url: "https://images.unsplash.com/photo-1653697469196-89c44bb81a98?auto=format&fit=crop&w=1600&q=80",
    alt: "Close-up top-down shot of a steaming bowl of ramen noodle soup",
  },
  "hero-catering": {
    url: "https://images.unsplash.com/photo-1547559101-69ffc8762cb2?auto=format&fit=crop&w=1600&q=80",
    alt: "Elegant Japanese-style meal with three dishes served in bowls on a wooden tray",
  },
  ramen: {
    url: "https://images.unsplash.com/photo-1637056930239-3b56a2034cb8?auto=format&fit=crop&w=1600&q=80",
    alt: "Bowl of ramen noodles on a table",
  },
  predyastiya: {
    url: "https://images.unsplash.com/photo-1738681336104-608b4e7dc3b0?auto=format&fit=crop&w=1600&q=80",
    alt: "Plate of golden pan-fried gyoza dumplings on a wooden table",
  },
  dobavki: {
    url: "https://images.unsplash.com/photo-1680137248876-6ad53db8caef?auto=format&fit=crop&w=1600&q=80",
    alt: "White bowl filled with steamed rice on a wooden table",
  },
  poke: {
    url: "https://images.unsplash.com/photo-1670816978291-a5cf23d87968?auto=format&fit=crop&w=1600&q=80",
    alt: "Salmon poke bowl with rice, edamame, avocado, cabbage and sesame seeds",
  },
  "koreysko-barbekyu": {
    url: "https://images.unsplash.com/photo-1550388341-d3d5ac2a724e?auto=format&fit=crop&w=1600&q=80",
    alt: "Thinly sliced meat cooking on a Korean BBQ grill",
  },
  "vina-byalo": {
    url: "https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?auto=format&fit=crop&w=1600&q=80",
    alt: "Clear wine glass filled with golden white wine",
  },
  "vina-roze": {
    url: "https://images.unsplash.com/photo-1616186793090-b49b8ca005e8?auto=format&fit=crop&w=1600&q=80",
    alt: "Rosé wine being poured into a glass",
  },
  "vina-cherveno": {
    url: "https://images.unsplash.com/photo-1606767351797-1664b860ae5a?auto=format&fit=crop&w=1600&q=80",
    alt: "Red wine pouring into a clear wine glass",
  },
  bezalkoholni: {
    url: "https://images.unsplash.com/photo-1513558003720-343f3a99d97b?auto=format&fit=crop&w=1600&q=80",
    alt: "Clear glass jar filled with refreshing lemonade juice",
  },
  "organichni-chaiove": {
    url: "https://images.unsplash.com/photo-1559175892-a918b243dac0?auto=format&fit=crop&w=1600&q=80",
    alt: "Green tea in a ceramic teacup",
  },
  "topli-napitki": {
    url: "https://images.unsplash.com/photo-1550071555-917d67a1188f?auto=format&fit=crop&w=1600&q=80",
    alt: "Coffee latte with latte art in a white cup",
  },
  bira: {
    url: "https://images.unsplash.com/photo-1720513840843-fd295b4acc35?auto=format&fit=crop&w=1600&q=80",
    alt: "Glass of craft beer with foam head",
  },
  sake: {
    url: "https://images.unsplash.com/photo-1761095596579-37f2f67c20bd?auto=format&fit=crop&w=1600&q=80",
    alt: "Traditional Japanese sake set with ceramic cups and pitcher on a tray",
  },
  "catering-topli-predyastiya": {
    url: "https://images.unsplash.com/photo-1603247902597-61ca1827c0d1?auto=format&fit=crop&w=1600&q=80",
    alt: "Assorted fried Asian appetizers served on a dark plate",
  },
  "catering-studeni-predyastiya": {
    url: "https://images.unsplash.com/photo-1581419409555-d4a6e6db1ee2?auto=format&fit=crop&w=1600&q=80",
    alt: "Colorful marinated vegetable salad in a white ceramic bowl, Japanese style",
  },
  "catering-tabli-bufeti": {
    url: "https://images.unsplash.com/photo-1686853021522-1b0e9a81706e?auto=format&fit=crop&w=1600&q=80",
    alt: "Elegant buffet table spread with multiple dishes under warm ambient lighting",
  },
  "catering-napitki": {
    url: "https://images.unsplash.com/photo-1652795905559-e75c86d07e67?auto=format&fit=crop&w=1600&q=80",
    alt: "Assorted drinks in varied glassware arranged on a catering table",
  },
} as const;

export type StockImageKey = keyof typeof stockImages;
