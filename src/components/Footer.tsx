import Link from "next/link";
import { navLinks, site } from "@/data/site";
import { InstagramIcon, MapPinIcon, PhoneIcon, FacebookIcon } from "@/components/icons";
import { WaveDivider } from "@/components/decor";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-pink-50/60">
      <WaveDivider className="h-6 w-full text-pink-100" />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-xl text-ink-900">{site.restaurantName}</p>
            <p className="mt-1 text-sm text-ink-500">{site.cateringName}</p>
            <p className="mt-4 text-sm text-ink-700">
              Японска кухня в {site.city} — рамен, поке и суши ястия на място, доставка и кетъринг за вашето събитие.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink-900">Навигация</p>
            <ul className="mt-4 space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-ink-700 hover:text-pink-600">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink-900">Контакти</p>
            <ul className="mt-4 space-y-3 text-sm text-ink-700">
              <li className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4 shrink-0 text-pink-500" />
                <a href={`tel:${site.phoneRestaurant.replace(/\s+/g, "")}`} className="hover:text-pink-600">
                  {site.phoneRestaurant}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-pink-500" />
                <span>{site.addressText}</span>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink-900">Последвайте ни</p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href={site.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-700 transition-colors hover:border-pink-400 hover:text-pink-600"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
              {site.facebookUrl && (
                <a
                  href={site.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-700 transition-colors hover:border-pink-400 hover:text-pink-600"
                >
                  <FacebookIcon className="h-5 w-5" />
                </a>
              )}
            </div>
            <Link
              href="/contacts"
              className="mt-4 inline-block text-sm font-medium text-pink-600 hover:text-pink-700"
            >
              Всички контакти →
            </Link>
          </div>
        </div>

        <div className="mt-10 border-t border-line pt-6 text-center text-xs text-ink-500">
          © {new Date().getFullYear()} {site.restaurantName} · {site.cateringName}
        </div>
      </div>
    </footer>
  );
}
