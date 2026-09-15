import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateCouponDiscount, isCouponUsable } from "@/lib/couponValidation";

export async function POST(request) {
  try {
    const { code, subtotal } = await request.json();

    if (!code?.trim()) {
      return NextResponse.json({ error: "Please enter a coupon code." }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.trim().toUpperCase() },
    });

    if (!coupon) {
      return NextResponse.json({ error: "Invalid coupon code." }, { status: 404 });
    }

    const usability = isCouponUsable(coupon);
    if (!usability.usable) {
      return NextResponse.json({ error: usability.error }, { status: 400 });
    }

    const result = calculateCouponDiscount(coupon, subtotal);
    if (!result.valid) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      code: coupon.code,
      discount: result.discount,
    });
  } catch (error) {
    console.error("Coupon validation error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}