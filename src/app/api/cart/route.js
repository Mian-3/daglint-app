import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Get the current user's cart
export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ items: [], subtotal: 0 });
  }

  const cart = await prisma.cart.findUnique({
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

  if (!cart) {
    return NextResponse.json({ items: [], subtotal: 0 });
  }

  const items = cart.items.map((item) => ({
    id: item.id,
    productId: item.productId,
    name: item.product.name,
    slug: item.product.slug,
    price: Number(item.product.price),
    image: item.product.images[0]?.url || null,
    quantity: item.quantity,
    stock: item.product.stock,
    lineTotal: Number(item.product.price) * item.quantity,
  }));

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);

  return NextResponse.json({ items, subtotal });
}

// Add a product to the cart (or increase quantity if it already exists)
export async function POST(request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: "Please login to add items to your cart." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { productId, quantity } = body;
    const qty = Math.max(1, parseInt(quantity) || 1);

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || !product.isActive) {
      return NextResponse.json(
        { error: "This product is not available." },
        { status: 404 }
      );
    }

    if (product.stock < qty) {
      return NextResponse.json(
        { error: "Not enough stock available." },
        { status: 400 }
      );
    }

    // Ensure the user has a cart
    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: session.user.id },
      });
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: productId,
        },
      },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + qty;

      if (product.stock < newQuantity) {
        return NextResponse.json(
          { error: "Not enough stock available." },
          { status: 400 }
        );
      }

      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: productId,
          quantity: qty,
        },
      });
    }

    return NextResponse.json({ message: "Added to cart." }, { status: 201 });
  } catch (error) {
    console.error("Cart POST error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}