import type { Metadata } from "next";
import type { MenuCategory, MenuItem } from "@/data/types";
import { site } from "@/data/site";
import { siteUrl } from "@/lib/siteUrl";

// 1200×630, the size Facebook and Twitter expect for a large preview.
const SHARE_IMAGE = {
  url: "https://images.unsplash.com/photo-1653697469196-89c44bb81a98?auto=format&fit=crop&w=1200&h=630&q=80",
  width: 1200,
  height: 630,
  alt: "Купа с рамен, снимана отгоре",
};

/** Title, description and share tags for one page. */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title?: string;
  description: string;
  path: string;
}): Metadata {
  const shareTitle = title ? `${title} | ${site.restaurantName}` : `${site.restaurantName} — ${site.cateringName}`;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "bg_BG",
      siteName: site.restaurantName,
      title: shareTitle,
      description,
      url: path,
      images: [SHARE_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description,
      images: [SHARE_IMAGE.url],
    },
  };
}

function internationalPhone(phone: string): string {
  return `+359${phone.replace(/\s+/g, "").replace(/^0/, "")}`;
}

export function restaurantJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${siteUrl}/#restaurant`,
    name: site.restaurantName,
    url: siteUrl,
    image: SHARE_IMAGE.url,
    telephone: internationalPhone(site.phoneRestaurant),
    servesCuisine: ["Japanese", "Ramen", "Poke"],
    hasMenu: `${siteUrl}/restaurant`,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.city,
      addressCountry: "BG",
    },
    openingHoursSpecification: site.hours.map((hours) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: hours.schemaDays,
      opens: hours.opens,
      closes: hours.closes,
    })),
    sameAs: [site.instagramUrl, site.facebookUrl].filter(Boolean),
  };
}

function menuItemJsonLd(item: MenuItem) {
  return {
    "@type": "MenuItem",
    name: item.name,
    description: item.description,
    image: item.imageUrl,
    suitableForDiet: item.vegetarian ? "https://schema.org/VegetarianDiet" : undefined,
    offers: {
      "@type": "Offer",
      price: item.priceEur.toFixed(2),
      priceCurrency: "EUR",
    },
  };
}

export function menuJsonLd(menu: MenuCategory[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: `Меню на ${site.restaurantName}`,
    url: `${siteUrl}/restaurant`,
    inLanguage: "bg",
    hasMenuSection: menu.map((category) => ({
      "@type": "MenuSection",
      name: category.name,
      description: category.note,
      hasMenuItem: (category.items ?? []).map(menuItemJsonLd),
      hasMenuSection: (category.subgroups ?? []).map((subgroup) => ({
        "@type": "MenuSection",
        name: subgroup.name,
        hasMenuItem: subgroup.items.map(menuItemJsonLd),
      })),
    })),
  };
}
