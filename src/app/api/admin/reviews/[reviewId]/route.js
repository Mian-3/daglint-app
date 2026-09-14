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
    const { reviewId } = await params;
    const body = await request.json();

    await prisma.review.update({
      where: { id: reviewId },
      data: { isApproved: body.isApproved },
    });

    return NextResponse.json({ message: "Review updated." });
  } catch (error) {
    console.error("Review update error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 403 });

  try {
    const { reviewId } = await params;
    await prisma.review.delete({ where: { id: reviewId } });
    return NextResponse.json({ message: "Review deleted." });
  } catch (error) {
    console.error("Review delete error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}