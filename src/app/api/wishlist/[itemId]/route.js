import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(request, { params }) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Please login." }, { status: 401 });
  }

  try {
    const { itemId } = await params;

    const item = await prisma.wishlistItem.findUnique({
      where: { id: itemId },
      include: { wishlist: true },
    });

    if (!item || item.wishlist.userId !== session.user.id) {
      return NextResponse.json({ error: "Item not found." }, { status: 404 });
    }

    await prisma.wishlistItem.delete({ where: { id: itemId } });

    return NextResponse.json({ message: "Removed from wishlist." });
  } catch (error) {
    console.error("Wishlist DELETE error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}