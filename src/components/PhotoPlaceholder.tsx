import type { ReactNode } from "react";
import Image from "next/image";

/**
 * Image slot for the site. Renders a real photo when `src` is given —
 * currently that's stock photography sourced as a stand-in so the site
 * has full visual coverage before the client's own photos arrive (brief
 * open question #2 / section 9). Swap `src` for a real photo URL/path
 * per item once available; no layout changes needed since callers just
 * pass a className controlling size/aspect ratio. Falls back to an
 * abstract gradient + icon placeholder when no `src` is set.
 */
export function PhotoPlaceholder({
  className = "",
  icon,
  src,
  alt,
  // Must reflect the image's actual rendered size in this className/context —
  // Next.js uses it to pick a srcset candidate. Getting this wrong (e.g. the
  // old blanket "50vw" default) makes small thumbnails fetch multi-megabyte
  // images sized for a hero banner, which visibly delays below-the-fold
  // content. Default assumes a small fixed-size thumbnail; hero/banner
  // callers should pass a wider value explicitly.
  sizes = "96px",
}: {
  className?: string;
  icon: ReactNode;
  src?: string;
  alt?: string;
  sizes?: string;
}) {
  if (src) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image src={src} alt={alt ?? ""} fill sizes={sizes} className="object-cover" />
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
