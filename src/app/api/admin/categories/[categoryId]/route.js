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
    const { categoryId } = await params;
    const body = await request.json();

    const category = await prisma.category.update({
      where: { id: categoryId },
      data: body,
    });

    return NextResponse.json({ message: "Category updated.", category });
  } catch (error) {
    console.error("Category update error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 403 });

  try {
    const { categoryId } = await params;

    const productCount = await prisma.product.count({ where: { categoryId } });
    const childCount = await prisma.category.count({ where: { parentId: categoryId } });

    if (productCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete: ${productCount} product(s) are assigned to this category.` },
        { status: 400 }
      );
    }

    if (childCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete: this category has ${childCount} sub-categor(y/ies).` },
        { status: 400 }
      );
    }

    await prisma.category.delete({ where: { id: categoryId } });

    return NextResponse.json({ message: "Category deleted." });
  } catch (error) {
    console.error("Category delete error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}