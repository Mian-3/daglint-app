import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

const GUEST_COOKIE = "guestId";

async function getCartForRequest(request, session) {
  if (session?.user) {
    return prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: { include: { images: { orderBy: { position: "asc" }, take: 1 } } },
          },
        },
      },
    });
  }

  const guestId = request.cookies.get(GUEST_COOKIE)?.value;
  if (!guestId) return null;

  return prisma.cart.findUnique({
    where: { guestId },
    include: {
      items: {
        include: {
          product: { include: { images: { orderBy: { position: "asc" }, take: 1 } } },
        },
      },
    },
  });
}

export async function GET(request) {
  const session = await auth();
  const cart = await getCartForRequest(request, session);

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

export async function POST(request) {
  const session = await auth();

  try {
    const body = await request.json();
    const { productId, quantity } = body;
    const qty = Math.max(1, parseInt(quantity) || 1);

    const product = await prisma.product.findUnique({ where: { id: productId } });

    if (!product || !product.isActive) {
      return NextResponse.json({ error: "This product is not available." }, { status: 404 });
    }

    if (product.stock < qty) {
      return NextResponse.json({ error: "Not enough stock available." }, { status: 400 });
    }

    let cart;
    let newGuestId = null;

    if (session?.user) {
      cart = await prisma.cart.findUnique({ where: { userId: session.user.id } });
      if (!cart) {
        cart = await prisma.cart.create({ data: { userId: session.user.id } });
      }
    } else {
      let guestId = request.cookies.get(GUEST_COOKIE)?.value;

      if (guestId) {
        cart = await prisma.cart.findUnique({ where: { guestId } });
      }

      if (!cart) {
        guestId = guestId || randomUUID();
        newGuestId = guestId;
        cart = await prisma.cart.create({ data: { guestId } });
      }
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + qty;
      if (product.stock < newQuantity) {
        return NextResponse.json({ error: "Not enough stock available." }, { status: 400 });
      }
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity: qty },
      });
    }

    const response = NextResponse.json({ message: "Added to cart." }, { status: 201 });

    if (newGuestId) {
      response.cookies.set(GUEST_COOKIE, newGuestId, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
        sameSite: "lax",
      });
    }

    return response;
  } catch (error) {
    console.error("Cart POST error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}