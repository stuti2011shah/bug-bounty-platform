export const CURRENCY_SYMBOL = "₹";

export function formatBounty(amount) {
  return `${CURRENCY_SYMBOL}${amount ?? 0}`;
}
