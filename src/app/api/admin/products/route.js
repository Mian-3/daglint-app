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

export async function POST(request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { images, ...productData } = body;

    if (!productData.name || !productData.slug || !productData.sku || !productData.categoryId) {
      return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
    }

    const existingSlug = await prisma.product.findUnique({ where: { slug: productData.slug } });
    if (existingSlug) {
      return NextResponse.json({ error: "A product with this slug already exists." }, { status: 409 });
    }

    const existingSku = await prisma.product.findUnique({ where: { sku: productData.sku } });
    if (existingSku) {
      return NextResponse.json({ error: "A product with this SKU already exists." }, { status: 409 });
    }

    const product = await prisma.product.create({
      data: {
        ...productData,
        images: {
          create: (images || []).map((url, index) => ({ url, position: index })),
        },
      },
    });

    return NextResponse.json({ message: "Product created.", product }, { status: 201 });
  } catch (error) {
    console.error("Product create error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}