import type { ReactNode } from "react";
import { SiteImage } from "@/components/SiteImage";

/**
 * Image slot for the site: a real photo when `src` is given, otherwise an
 * abstract gradient and icon. Callers control size and aspect ratio via className.
 */
export function PhotoPlaceholder({
  className = "",
  icon,
  src,
  alt,
  // Must reflect the image's actual rendered size in this className/context —
  // Next.js uses it to pick a srcset candidate. Getting this wrong makes small
  // slots fetch images sized for a hero banner. There is no default on purpose.
  sizes,
  eager = false,
}: {
  className?: string;
  icon: ReactNode;
  src?: string;
  alt: string;
  sizes: string;
  /** For photos on the first screen: lazy loading would delay them until layout. */
  eager?: boolean;
}) {
  if (src) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <SiteImage src={src} alt={alt} fill sizes={sizes} loading={eager ? "eager" : "lazy"} className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-pink-100 via-pink-50 to-white ${className}`}
    >
      <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_1px_1px,var(--color-pink-300)_1px,transparent_0)] [background-size:16px_16px]" />
      <div className="relative text-pink-300/80">{icon}</div>
    </div>
  );
}
