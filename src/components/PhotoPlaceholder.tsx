import type { ReactNode } from "react";

/**
 * Stand-in for real photography. The brief (open question #2 / section 9)
 * flags that food, interior and event photos are still to be supplied —
 * this keeps every image slot visually finished in the meantime. Swap for
 * <Image> once real photos land; no layout changes needed since callers
 * just pass a className controlling size/aspect ratio.
 */
export function PhotoPlaceholder({
  className = "",
  icon,
}: {
  className?: string;
  icon: ReactNode;
}) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-pink-100 via-pink-50 to-white ${className}`}
    >
      <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_1px_1px,var(--color-pink-300)_1px,transparent_0)] [background-size:16px_16px]" />
      <div className="relative text-pink-300/80">{icon}</div>
    </div>
  );
}
