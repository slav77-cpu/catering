/**
 * Temporary catering pricing model.
 *
 * The client hasn't sent a real catering price list yet (brief §5.3/§9).
 * Per an explicit call from the project owner, until that arrives the
 * catering menu is seeded from the restaurant's real, confirmed prices
 * with a flat markup — NOT presented as final pricing, just a working
 * placeholder so the catering page isn't empty. Swap CATERING_MARKUP or
 * replace src/data/cateringContent.ts's `cateringMenu` wholesale once the
 * client sends real catering dishes/prices.
 */
export const CATERING_MARKUP = 0.15;

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function cateringPriceFrom(priceEur: number, priceBgn: number) {
  return {
    priceEur: round2(priceEur * (1 + CATERING_MARKUP)),
    priceBgn: round2(priceBgn * (1 + CATERING_MARKUP)),
  };
}
