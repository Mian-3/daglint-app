import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return null;
  }
  return session;
}

export async function PATCH(request, { params }) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
  }

  try {
    const { productId } = await params;
    const body = await request.json();
    const { images, ...productData } = body;

    await prisma.productImage.deleteMany({ where: { productId } });

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        ...productData,
        images: {
          create: (images || []).map((url, index) => ({ url, position: index })),
        },
      },
    });

    return NextResponse.json({ message: "Product updated.", product });
  } catch (error) {
    console.error("Product update error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
  }

  try {
    const { productId } = await params;

    await prisma.product.update({
      where: { id: productId },
      data: { isActive: false },
    });

    return NextResponse.json({ message: "Product deactivated." });
  } catch (error) {
    console.error("Product delete error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}