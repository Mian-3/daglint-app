import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") return null;
  return session;
}

export async function PATCH(request, { params }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 403 });

  try {
    const { couponId } = await params;
    const body = await request.json();

    const coupon = await prisma.coupon.update({
      where: { id: couponId },
      data: body,
    });

    return NextResponse.json({ message: "Coupon updated.", coupon });
  } catch (error) {
    console.error("Coupon update error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 403 });

  try {
    const { couponId } = await params;
    await prisma.coupon.delete({ where: { id: couponId } });
    return NextResponse.json({ message: "Coupon deleted." });
  } catch (error) {
    console.error("Coupon delete error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}