import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const GUEST_COOKIE = "guestId";

function ownsCart(cart, session, guestId) {
  if (session?.user) return cart.userId === session.user.id;
  if (guestId) return cart.guestId === guestId;
  return false;
}

export async function PATCH(request, { params }) {
  const session = await auth();
  const guestId = request.cookies.get(GUEST_COOKIE)?.value;

  try {
    const { itemId } = await params;
    const body = await request.json();
    const quantity = Math.max(1, parseInt(body.quantity) || 1);

    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true, product: true },
    });

    if (!item || !ownsCart(item.cart, session, guestId)) {
      return NextResponse.json({ error: "Item not found." }, { status: 404 });
    }

    if (item.product.stock < quantity) {
      return NextResponse.json({ error: "Not enough stock available." }, { status: 400 });
    }

    await prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });

    return NextResponse.json({ message: "Cart updated." });
  } catch (error) {
    console.error("Cart PATCH error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const session = await auth();
  const guestId = request.cookies.get(GUEST_COOKIE)?.value;

  try {
    const { itemId } = await params;

    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (!item || !ownsCart(item.cart, session, guestId)) {
      return NextResponse.json({ error: "Item not found." }, { status: 404 });
    }

    await prisma.cartItem.delete({ where: { id: itemId } });

    return NextResponse.json({ message: "Item removed." });
  } catch (error) {
    console.error("Cart DELETE error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}