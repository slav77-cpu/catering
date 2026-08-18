/** Trims trailing zeros: 12 -> "12", 1.5 -> "1.5", 23.47 -> "23.47" */
function trimNumber(value: number): string {
  return parseFloat(value.toFixed(2)).toString();
}

/** Formats a EUR/BGN pair the way the source menu shows them: "12 € / 23.47 лв" */
export function formatPrice(priceEur: number, priceBgn: number): string {
  return `${trimNumber(priceEur)} € / ${trimNumber(priceBgn)} лв`;
}

export function allergenNames(codes: number[] | undefined, legend: { code: number; name: string }[]): string[] {
  if (!codes || codes.length === 0) return [];
  return codes
    .map((code) => legend.find((a) => a.code === code)?.name)
    .filter((name): name is string => Boolean(name));
}
