export const FREE_SHIPPING_THRESHOLD = 1500;
export const SHIPPING_FLAT_RATE = 250;

export function calculateShipping(subtotal) {
  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    return 0;
  }
  return SHIPPING_FLAT_RATE;
}

export function getAmountLeftForFreeShipping(subtotal) {
  return Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
}