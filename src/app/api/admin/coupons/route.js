import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") return null;
  return session;
}

export async function POST(request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 403 });

  try {
    const body = await request.json();

    if (!body.code || !body.discountValue) {
      return NextResponse.json({ error: "Code and discount value are required." }, { status: 400 });
    }

    const existing = await prisma.coupon.findUnique({ where: { code: body.code } });
    if (existing) {
      return NextResponse.json({ error: "A coupon with this code already exists." }, { status: 409 });
    }

    const coupon = await prisma.coupon.create({ data: body });
    return NextResponse.json({ message: "Coupon created.", coupon }, { status: 201 });
  } catch (error) {
    console.error("Coupon create error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}