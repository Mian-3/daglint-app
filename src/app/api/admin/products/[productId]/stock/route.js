import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request, { params }) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
  }

  try {
    const { productId } = await params;
    const body = await request.json();
    const stock = Math.max(0, parseInt(body.stock) || 0);

    await prisma.product.update({
      where: { id: productId },
      data: { stock },
    });

    return NextResponse.json({ message: "Stock updated." });
  } catch (error) {
    console.error("Stock update error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}