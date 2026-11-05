import type { MenuItem } from "@/data/types";
import { formatPrice } from "@/lib/format";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import { BowlIcon, LeafIcon } from "@/components/icons";

// Two columns on phones, three from `lg`, inside the site's 1152px max-width container.
const GRID_SIZES = "(min-width: 1152px) 368px, (min-width: 1024px) 33vw, 50vw";

// The most cards a row can hold.
const FIRST_ROW = 3;

export function MenuItemGrid({
  items,
  onOpen,
  isFirstOnPage = false,
}: {
  items: MenuItem[];
  onOpen: (item: MenuItem) => void;
  /** The first row's photos are then the page's largest paint, so they load eagerly. */
  isFirstOnPage?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
      {items.map((item, index) => (
        <MenuItemCard key={item.id} item={item} onOpen={onOpen} eager={isFirstOnPage && index < FIRST_ROW} />
      ))}
    </div>
  );
}

export function MenuItemCard({
  item,
  onOpen,
  eager = false,
}: {
  item: MenuItem;
  onOpen: (item: MenuItem) => void;
  eager?: boolean;
}) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow focus-within:ring-2 focus-within:ring-pink-500 hover:shadow-md">
      <PhotoPlaceholder
        className="aspect-[4/3] w-full"
        icon={<BowlIcon className="h-12 w-12" />}
        src={item.imageUrl}
        alt={item.imageAlt ?? item.name}
        sizes={GRID_SIZES}
        eager={eager}
      />
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <h3 className="font-display text-base leading-snug text-ink-900 sm:text-lg">
          {/* The button's ::after covers the whole card, so a tap anywhere opens the panel. */}
          <button
            type="button"
            onClick={() => onOpen(item)}
            aria-haspopup="dialog"
            className="text-left after:absolute after:inset-0 focus:outline-none group-hover:text-pink-700"
          >
            {item.name}
          </button>
          {item.vegetarian && (
            <span className="ml-1.5 inline-block align-[-2px]">
              <LeafIcon className="h-4 w-4 text-green-700" />
              <span className="sr-only">Вегетарианско</span>
            </span>
          )}
        </h3>
        {/* In the HTML on phones too, so search engines read every description. */}
        {item.description && (
          <p className="mt-1 hidden text-sm text-ink-700 sm:line-clamp-2">{item.description}</p>
        )}
        <div className="mt-auto pt-2">
          {item.portion && <p className="text-xs text-ink-700">{item.portion}</p>}
          <p className="text-sm font-semibold text-ink-900">{formatPrice(item.priceEur, item.priceBgn)}</p>
        </div>
      </div>
    </article>
  );
}
