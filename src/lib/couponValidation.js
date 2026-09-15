export function calculateCouponDiscount(coupon, subtotal) {
  const discountValue = Number(coupon.discountValue);
  const minOrderAmount = coupon.minOrderAmount ? Number(coupon.minOrderAmount) : 0;
  const maxDiscount = coupon.maxDiscount ? Number(coupon.maxDiscount) : null;

  if (subtotal < minOrderAmount) {
    return { valid: false, error: `Minimum order amount is Rs. ${minOrderAmount.toLocaleString()}.` };
  }

  let discount;
  if (coupon.discountType === "PERCENTAGE") {
    discount = (subtotal * discountValue) / 100;
    if (maxDiscount && discount > maxDiscount) {
      discount = maxDiscount;
    }
  } else {
    discount = discountValue;
  }

  discount = Math.min(discount, subtotal);

  return { valid: true, discount };
}

export function isCouponUsable(coupon) {
  if (!coupon.isActive) {
    return { usable: false, error: "This coupon is no longer active." };
  }
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return { usable: false, error: "This coupon has expired." };
  }
  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
    return { usable: false, error: "This coupon has reached its usage limit." };
  }
  return { usable: true };
}