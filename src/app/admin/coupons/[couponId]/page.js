import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CouponForm from "@/components/admin/CouponForm";

export const dynamic = "force-dynamic";

async function getCoupon(id) {
  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon) return null;

  return {
    ...coupon,
    discountValue: Number(coupon.discountValue),
    minOrderAmount: coupon.minOrderAmount ? Number(coupon.minOrderAmount) : null,
    maxDiscount: coupon.maxDiscount ? Number(coupon.maxDiscount) : null,
  };
}

export default async function EditCouponPage({ params }) {
  const { couponId } = await params;
  const coupon = await getCoupon(couponId);

  if (!coupon) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-ink-900 mb-1">
        Edit Coupon
      </h1>
      <p className="text-sm text-ink-600 mb-6">{coupon.code}</p>

      <CouponForm initialData={coupon} />
    </div>
  );
}