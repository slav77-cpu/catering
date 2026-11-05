import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";
import { siteUrl } from "@/lib/siteUrl";

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin", "cyrillic"],
});

const displayFont = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  ...pageMetadata({
    description:
      "MAKA RAMEN — японска кухня в Пловдив: рамен, поке и суши ястия. MAKA CATERING — кетъринг за частни и фирмени събития.",
    path: "/",
  }),
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.restaurantName} — Японски ресторант и кетъринг в ${site.city}`,
    template: `%s | ${site.restaurantName}`,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="bg" className={`${bodyFont.variable} ${displayFont.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-cream text-ink-900">{children}</body>
    </html>
  );
}
