"use client";

import { useEffect, useRef, type MouseEvent, type TouchEvent } from "react";
import type { MenuItem } from "@/data/types";
import { allergenLegend } from "@/data/allergens";
import { allergenNames, formatPrice } from "@/lib/format";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import { BowlIcon, CloseIcon, LeafIcon } from "@/components/icons";

const SWIPE_CLOSE_DISTANCE = 100;
const SHEET_TRANSITION_MS = 180;

/** Panel content. Also used on its own by the admin panel's preview. */
export function MenuItemDetails({ item, headingId }: { item: MenuItem; headingId?: string }) {
  const allergens = allergenNames(item.allergens, allergenLegend);

  return (
    <>
      <PhotoPlaceholder
        className="aspect-[4/3] w-full"
        icon={<BowlIcon className="h-16 w-16" />}
        src={item.imageUrl}
        alt={item.imageAlt ?? item.name}
        sizes="(min-width: 640px) 640px, 100vw"
      />
      <div className="space-y-3 p-5 sm:p-7">
        <div>
          <h2 id={headingId} className="font-display text-2xl leading-snug text-ink-900">
            {item.name}
          </h2>
          {item.vegetarian && (
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-green-700">
              <LeafIcon className="h-4 w-4" />
              Вегетарианско
            </p>
          )}
        </div>
        <p className="flex flex-wrap items-baseline gap-x-3 text-lg font-semibold text-ink-900">
          {formatPrice(item.priceEur, item.priceBgn)}
          {item.portion && <span className="text-sm font-normal text-ink-700">{item.portion}</span>}
        </p>
        {item.description && <p className="text-ink-700">{item.description}</p>}
        {allergens.length > 0 && (
          <p className="text-sm text-ink-700">
            <span className="font-medium text-ink-900">Алергени: </span>
            {allergens.join(", ")}
          </p>
        )}
        {item.note && <p className="text-sm text-pink-700">{item.note}</p>}
      </div>
    </>
  );
}

/**
 * Item details in a native modal <dialog>, which brings the focus trap, Esc to
 * close and focus return. A bottom sheet on phones (swipe down to close), a
 * centered panel from `sm` up.
 */
export function MenuDetailsPanel({ item, onClose }: { item: MenuItem; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const swipe = useRef<{ startY: number; distance: number } | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    // Attached natively because React's touchmove is passive, and the browser has
    // to be told not to claim the gesture as an overscroll, or it may cancel the touch.
    function handleTouchMove(event: globalThis.TouchEvent) {
      if (!swipe.current || !dialog) return;
      const distance = event.touches[0].clientY - swipe.current.startY;
      if (distance < 0) {
        swipe.current = null; // upward: an ordinary scroll
        dialog.style.transform = "";
        return;
      }
      if (event.cancelable) event.preventDefault();
      swipe.current.distance = distance;
      dialog.style.transition = "none";
      dialog.style.transform = `translateY(${distance}px)`;
    }
    dialog.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      root.style.overflow = previousOverflow;
      dialog.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    // Clicks on the content land on a child; only the backdrop targets the dialog.
    if (event.target === dialogRef.current) dialogRef.current.close();
  }

  function handleTouchStart(event: TouchEvent<HTMLDialogElement>) {
    // Swiping down inside scrolled content must scroll it, not close the panel.
    swipe.current = dialogRef.current?.scrollTop === 0 ? { startY: event.touches[0].clientY, distance: 0 } : null;
  }

  function handleTouchEnd() {
    const dialog = dialogRef.current;
    const distance = swipe.current?.distance ?? 0;
    swipe.current = null;
    if (!dialog || distance === 0) return;

    dialog.style.transition = `transform ${SHEET_TRANSITION_MS}ms ease-out`;
    if (distance > SWIPE_CLOSE_DISTANCE) {
      dialog.style.transform = "translateY(100%)";
      window.setTimeout(() => dialog.close(), SHEET_TRANSITION_MS);
    } else {
      dialog.style.transform = "";
    }
  }

  const headingId = `menu-item-${item.id}`;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={headingId}
      onClose={onClose}
      onClick={handleBackdropClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      data-testid="menu-details-panel"
      className="sheet-in m-0 mt-auto max-h-[90dvh] w-full max-w-none overflow-y-auto overscroll-contain rounded-t-3xl bg-white text-ink-900 backdrop:bg-ink-900/60 sm:m-auto sm:w-[calc(100%-3rem)] sm:max-w-2xl sm:rounded-3xl"
    >
      <div className="relative">
        {/* Swipe handle, phones only */}
        <div className="absolute inset-x-0 top-2 z-10 flex justify-center sm:hidden" aria-hidden="true">
          <span className="h-1.5 w-12 rounded-full bg-white/90 shadow" />
        </div>
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          aria-label="Затвори"
          className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-ink-900 shadow transition-colors hover:bg-white"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
        <MenuItemDetails item={item} headingId={headingId} />
      </div>
    </dialog>
  );
}
