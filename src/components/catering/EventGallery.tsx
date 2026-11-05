import type { GalleryImage } from "@/data/types";
import { SectionHeading } from "@/components/SectionHeading";
import { SiteImage } from "@/components/SiteImage";

/** Photos from past events, uploaded in the admin panel. Renders nothing until there are some. */
export function EventGallery({ photos }: { photos: GalleryImage[] }) {
  if (photos.length === 0) return null;

  return (
    <section id="galeriya" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8" data-testid="event-gallery">
      <SectionHeading kicker="Галерия" title="Снимки от наши събития" />
      <div className="mt-8 columns-2 gap-3 sm:gap-5 lg:columns-3">
        {photos.map((photo) => (
          <figure key={photo.id} className="mb-3 break-inside-avoid sm:mb-5">
            <SiteImage
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(min-width: 1152px) 368px, (min-width: 1024px) 33vw, 50vw"
              className="h-auto w-full rounded-2xl"
            />
            {photo.caption && <figcaption className="mt-1.5 text-sm text-ink-700">{photo.caption}</figcaption>}
          </figure>
        ))}
      </div>
    </section>
  );
}
