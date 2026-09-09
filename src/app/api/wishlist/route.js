import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Get the current user's wishlist
export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ items: [] });
  }

  const wishlist = await prisma.wishlist.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          product: {
            include: { images: { orderBy: { position: "asc" }, take: 1 } },
          },
        },
      },
    },
  });

  if (!wishlist) {
    return NextResponse.json({ items: [] });
  }

  const items = wishlist.items.map((item) => ({
    id: item.id,
    productId: item.productId,
    name: item.product.name,
    slug: item.product.slug,
    price: Number(item.product.price),
    image: item.product.images[0]?.url || null,
    stock: item.product.stock,
  }));

  return NextResponse.json({ items });
}

// Add a product to the wishlist
export async function POST(request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: "Please login to add items to your wishlist." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { productId } = body;

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    let wishlist = await prisma.wishlist.findUnique({
      where: { userId: session.user.id },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId: session.user.id },
      });
    }

    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId: productId,
        },
      },
    });

    if (existingItem) {
      return NextResponse.json(
        { message: "Already in wishlist." },
        { status: 200 }
      );
    }

    await prisma.wishlistItem.create({
      data: { wishlistId: wishlist.id, productId },
    });

    return NextResponse.json({ message: "Added to wishlist." }, { status: 201 });
  } catch (error) {
    console.error("Wishlist POST error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}