/** Currency punctuation must not become a decimal separator (Rs.4,198). */
export function parsePrice(value: string): number {
  return Number(value.replace(/Rs\.?|PKR|\$/gi, '').replace(/,/g, '').replace(/[^\d.]/g, '')) || 0;
}
